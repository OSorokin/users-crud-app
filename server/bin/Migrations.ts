import * as yargs from 'yargs';
import * as util from 'util';
import config from '../app/configuration';
import DbMigrations from '../app/db/DbMigrations';

const logger = require('../app/logger/logger').getLogger(__filename);

class MigrationsExecutor {

  private static ACTION = {
    generateChangelog: 'generate-changelog',
    applyChangelogs: 'apply-changelogs',
    validateScheme: 'validate-scheme',
    syncSchemeWithModels: 'sync-scheme-with-models'
  };

  static async exec(): Promise<void> {
    logger.info('Migrations execute');

    const migrationArguments = yargs
      .alias('a', 'action')
      .describe('a', 'choose migration action')
      .choices('a', [
        MigrationsExecutor.ACTION.generateChangelog,
        MigrationsExecutor.ACTION.applyChangelogs,
        MigrationsExecutor.ACTION.validateScheme,
        MigrationsExecutor.ACTION.syncSchemeWithModels
      ])
      .default('a', [MigrationsExecutor.ACTION.generateChangelog])
      .help('help')
      .argv;

    const migrations: DbMigrations = await DbMigrations.initialize(config);

    if (migrationArguments.action == MigrationsExecutor.ACTION.generateChangelog) {
      logger.info('Generating new changelog started');
      return migrations.generateNewChangelog();
    }

    if (migrationArguments.action == MigrationsExecutor.ACTION.validateScheme) {
      logger.info('Scheme validation started');
      return migrations.validateScheme();
    }

    if (migrationArguments.action == MigrationsExecutor.ACTION.applyChangelogs) {
      logger.info('Applying migrations started');
      return migrations.applyMigrations();
    }

    if (migrationArguments.action == MigrationsExecutor.ACTION.syncSchemeWithModels) {
      logger.warn('Scheme synchronisation with models started');
      return migrations.syncSchemeWithModels();
    }

    logger.error(`Unexpected migrations actions: ${migrationArguments.action}`);
    throw new Error(`Unexpected migrations actions: ${migrationArguments.action}`);
  }
}

MigrationsExecutor.exec()
  .then(() => {
    logger.info('Ok! Done.');
    process.exit(0);
  })
  .catch((e) => {
    logger.error(`Error occurred! {e: "${util.inspect(e)}", stack: "${e.stack}"}`);
    process.exit(1);
  });