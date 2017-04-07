const logger = require('../logger/logger').getLogger(__filename);

import { MODE } from '../configuration/env';
import * as _ from 'lodash';
import * as childProcess from 'child_process';
import * as moment from 'moment';
import * as Sequelize from 'sequelize';
import * as path from 'path';
import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as util from 'util';
import { USERS_CRUD_APP_CONFIGURATION } from '../../typings';
import { initializeSequelizeModels } from '../models';
import { initializeConnection } from './DbUtils';

const pgtools = require('pgtools');

export default class DbMigrations {

  private static NOW_AS_STRING = moment().format('YYYYMMDD-HHmm');

  private static CONFIGURATION = {
    migrationsDir: path.join(__dirname, '..','..','migrations'),
    liquibaseJar: path.join('bin', 'liquibase.jar'),
    postgresqlJar: path.join('bin', 'postgresql-9.4.1212.jar'),
    generatedChangelogOutput: path.join('changelogs', `db.changelog-${DbMigrations.NOW_AS_STRING}.xml`),
    mainChangelog: 'db.changelog.xml'
  };

  private _temporaryDbToSynchronizeSchemeBySequelize;

  private constructor(private _env: USERS_CRUD_APP_CONFIGURATION.EnvConfig,
                      private _appMode: string) {
    this._temporaryDbToSynchronizeSchemeBySequelize = this._env.database.temporaryDatabaseName;
  }

  public static async initialize(configuration: USERS_CRUD_APP_CONFIGURATION.FullConfiguration): Promise<DbMigrations> {
    logger.info(`Migrations logic initialized for mode: ${configuration.getMode()}`);
    return new DbMigrations(configuration.env(), configuration.getMode());
  }

  public async generateNewChangelog(): Promise<void> {
    if (this._appMode != MODE.migrations) {
      throw new Error(`Invalid migrations usage. For generating changelogs you can use only mode: ${MODE.migrations}`)
    }

    await this.synchronizeTempDbWithSequelizeModels();
    await this.prepareCleanDb(this._env.database.name);
    await this.applyMigrationsToDb(this._env.database.name);
    const changelogFile = path.join(
      DbMigrations.CONFIGURATION.migrationsDir,
      DbMigrations.CONFIGURATION.generatedChangelogOutput
    );
    await this.generateChangelog(changelogFile);
  }

  public async applyMigrations(): Promise<void> {
    await this.applyMigrationsToDb(this._env.database.name);
  }

  public async syncSchemeWithModels(): Promise<void> {
    await this.synchronizeSequelizeModels(this._env.database);
  }

  public async validateScheme(): Promise<void> {
    await this.synchronizeTempDbWithSequelizeModels();

    // here we use ANOTHER changelog fileName to prevent situations when previously created
    // real changelog is rewritten by temporary changelog file
    const changelogFile = path.join(
      DbMigrations.CONFIGURATION.migrationsDir,
      DbMigrations.CONFIGURATION.generatedChangelogOutput
    ) + '.tmp.xml';
    await this.generateChangelog(changelogFile);
    await this.checkThatChangelogIsEmpty(changelogFile);
    await this.deleteChangelog(changelogFile);
  }

  private async synchronizeTempDbWithSequelizeModels(): Promise<void> {
    await this.prepareCleanDb(this._temporaryDbToSynchronizeSchemeBySequelize);
    const specifiedSettings = _.cloneDeep(this._env.database);
    specifiedSettings.name = this._temporaryDbToSynchronizeSchemeBySequelize;
    await this.synchronizeSequelizeModels(specifiedSettings);
  }

  private async synchronizeSequelizeModels(databaseConfig: USERS_CRUD_APP_CONFIGURATION.DatabaseConfig): Promise<void> {
    if (this._appMode != MODE.test) {
      const isConnectionToMainDB: boolean = this._env.database.name == databaseConfig.name;
      if (isConnectionToMainDB) {
        throw new Error('Invalid migrations usage. Sequelize cannot be synchronized with main db. Detected: '
          + `mainDb=${this._env.database.name}, `
          + `modelsSyncDb=${databaseConfig.name}`
        );
      }
    }

    logger.info(`Sequelize models synchronisation for db: ${databaseConfig.name}`);

    const connection: Sequelize.Sequelize = initializeConnection(logger, databaseConfig);
    initializeSequelizeModels(connection);
    await connection.sync({
      force: true
    });
    connection.close();

    logger.info('Sequelize models synchronisation done');
  }

  private async prepareCleanDb(databaseName: string): Promise<void> {
    logger.info(`Preparing clean temporary database: ${databaseName} `);
    const config = {
      user: this._env.database.username,
      password: this._env.database.password,
      port: this._env.database.settings.port,
      host: this._env.database.settings.host
    };

    return pgtools.createdb(config, databaseName)
      .catch(() => {
        return pgtools.dropdb(config, databaseName)
          .then(() => pgtools.createdb(config, databaseName))
      })
      .then(() => logger.info('Preparing clean temporary database done.'));
  }

  private async applyMigrationsToDb(databaseName: string) {
    logger.info(`Applying migrations to db: ${databaseName}`);
    logger.info(`liquibaseJar: ` + DbMigrations.CONFIGURATION.liquibaseJar);
    logger.info(`postgresqlJar: ` + DbMigrations.CONFIGURATION.postgresqlJar);
    logger.info(`mainChangelog: ` + DbMigrations.CONFIGURATION.mainChangelog);
    logger.info(`migrationsDir: ` + DbMigrations.CONFIGURATION.migrationsDir);
    return new Promise((resolve, reject) => {
      childProcess.exec(
        `java -jar ${DbMigrations.CONFIGURATION.liquibaseJar} ` +
        `    --classpath=${DbMigrations.CONFIGURATION.postgresqlJar} ` +
        `    --changeLogFile=${DbMigrations.CONFIGURATION.mainChangelog} ` +
        `    --driver=org.postgresql.Driver ` +
        `    --username=${this._env.database.username} ` +
        `    --password=${this._env.database.password} ` +
        `    --url=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${databaseName} ` +
        `  update`,
        {
          cwd: DbMigrations.CONFIGURATION.migrationsDir
        },
        (error: Error, stdout: string, stderr: string) => {
          logger.info('Liquibase process stdout: ' + stdout);
          logger.info('Liquibase process stderr: ' + stderr);
          if (error == null) {
            logger.info('Applying migrations done');
            resolve();
            return;
          }
          logger.error('Applying migrations done with error');
          reject(error);
        }
      );
    });
  }

  private async generateChangelog(outputFileName: string): Promise<void> {
    logger.info(`Generating changelog as difference ` +
      `between ${this._temporaryDbToSynchronizeSchemeBySequelize} ` +
      `and ${this._env.database.name}. `
    );

    return new Promise<void>((resolve, reject) => {
      childProcess.exec(
        `java -jar ${DbMigrations.CONFIGURATION.liquibaseJar} ` +
        `    --classpath=${DbMigrations.CONFIGURATION.postgresqlJar} ` +
        `    --changeLogFile=${outputFileName} ` +
        `    --driver=org.postgresql.Driver ` +
        `    --username=${this._env.database.username} ` +
        `    --password=${this._env.database.password} ` +
        `    --url=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${this._env.database.name} ` +
        `  diffChangeLog ` +
        `    --referenceUrl=jdbc:postgresql://${this._env.database.settings.host}:${this._env.database.settings.port}/${this._temporaryDbToSynchronizeSchemeBySequelize} ` +
        `    --referenceUsername=${this._env.database.username} ` +
        `    --referencePassword=${this._env.database.password}`,
        {
          cwd: DbMigrations.CONFIGURATION.migrationsDir
        },
        (error: Error, stdout: string, stderr: string) => {
          logger.info('Liquibase process stdout: ' + stdout);
          logger.info('Liquibase process stderr: ' + stderr);
          if (error == null) {
            logger.info(`Generating changelog done: ${outputFileName}`);
            resolve();
            return;
          }
          logger.error('Generating changelog done with error');
          reject(error);
        }
      );
    });
  }

  private checkThatChangelogIsEmpty(changelogFile: string): Promise<void> {
    logger.info('Checking that changelog is empty');

    const xml: string = fs.readFileSync(changelogFile, {encoding: 'utf8'});
    const parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      parser.parseString(xml, (err, json) => {
        if (err != null) {
          reject(err);
        } else {
          resolve(json);
        }
      })
    }).then(json => {
      const databaseChangelogSection = json['databaseChangeLog'];
      if (databaseChangelogSection == null) {
        throw new Error('Error while checking changelog emptiness. "databaseChangeLog" section missed');
      }

      if (databaseChangelogSection['$'] == null) {
        throw new Error('Error while checking changelog emptiness. "databaseChangeLog" section meta missed');
      }

      delete databaseChangelogSection['$'];

      const keys = _.keys(databaseChangelogSection);
      if (keys.length > 0) {
        throw new Error(`Error while checking changelog emptiness. "databaseChangeLog" section has something: ${keys}`);
      }

      logger.info('Checking done, changelog is empty')
    });
  }

  private deleteChangelog(changelogFile: string): Promise<void> {
    return new Promise(resolve => {
      fs.unlink(changelogFile, err => {
        if (err == null) {
          logger.info('Temporary changelog file deleted');
          return resolve();
        }
        logger.error(`Temporary changelog file cannot be deleted ${util.inspect(err)}`);
        return resolve();
      })
    });
  }
}
