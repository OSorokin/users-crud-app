import * as winston from 'winston';
import * as _ from 'lodash';
import * as Sequelize from 'sequelize';
import { USERS_CRUD_APP_CONFIGURATION } from '../../typings';

const pg = require('pg');
pg.defaults.parseInt8 = true;

require('pg-parse-float')(pg);

export function initializeConnection(logger: winston.LoggerInstance, config: USERS_CRUD_APP_CONFIGURATION.DatabaseConfig): Sequelize.Sequelize {

  // logging option is declared in current file because if it does in configuration files then it leads to
  // circular dependencies issues
  const options: Sequelize.Options = _.cloneDeep(config.settings);
  options.logging = logger.info;

  return new Sequelize(config.name, config.username, config.password, options);
}
