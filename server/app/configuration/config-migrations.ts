import { USERS_CRUD_APP_CONFIGURATION } from '../../typings';

const SERVER: USERS_CRUD_APP_CONFIGURATION.ServerConfig = {
  port: '3000',
  url: 'http://localhost:3000'
};

const DATABASE: USERS_CRUD_APP_CONFIGURATION.DatabaseConfig = {
  temporaryDatabaseName: 'users-crud-app-migrations-from-changelogs',
  name: 'users-crud-app-migrations-from-models',
  username: 'postgres',
  password: 'postgres',
  settings: {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    pool: {
      max: 3,
      min: 1,
      idle: 5000
    }
  }
};

//noinspection TypeScriptValidateTypes
const LOG: USERS_CRUD_APP_CONFIGURATION.LogConfig = {
  transports: [{
    type: 'console',
    level: 'silly'
  }]
};

export default <USERS_CRUD_APP_CONFIGURATION.EnvConfig> {
  server: SERVER,
  database: DATABASE,
  log: LOG
};