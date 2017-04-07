import connection from './db/connection';
import { initializeSequelizeModels } from './models';

const logger = require('../app/logger/logger').getLogger(__filename);

export default class Context {

  public static async init(): Promise<void> {
    try {
      await initializeSequelizeModels(connection);
    } catch (err) {
      logger.error('Error while initialization: ' + err);
      throw err;
    }
  }

}