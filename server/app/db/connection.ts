import * as Sequelize from 'sequelize';
import * as dbUtils from './DbUtils';
import config from '../configuration/index';
import { getLogger } from '../logger/logger';

const logger = getLogger(__filename);
const connection: Sequelize.Sequelize = dbUtils.initializeConnection(logger, config.env().database);

connection.authenticate().then(function() {
  console.log('Connect to DB created!');
}).catch(function(err) {
  console.log('Connection error: ' + err);
});
export default connection;