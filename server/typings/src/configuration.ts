import * as Sequelize from 'sequelize';

export namespace USERS_CRUD_APP_CONFIGURATION {

  export interface DatabaseConfig {
    temporaryDatabaseName?: string;
    name: string;
    username: string;
    password: string;
    settings: Sequelize.Options;
  }

  export interface ServerConfig {
    port: string;
    url: string;
  }

  export type LogTransportType = 'console' | 'loggly';

// https://github.com/winstonjs/winston#logging-levels
  export type LogLevelType = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

  export interface LogTransport {
    type: LogTransportType;
    level: LogLevelType;
    configuration?: any;
  }

  export interface LogConfig {
    transports: LogTransport[];
  }

  export interface FileSystemConfig {
    superAdminsFile: string;
    webappStaticFolder: string;
  }

  export interface EnvConfig {
    server: ServerConfig;
    database: DatabaseConfig;
    log: LogConfig;
  }

  export interface FullConfiguration {
    env(): EnvConfig;
    isLocal(): boolean;
    isTest(): boolean;
    getMode(): string;
    DATE_FORMAT: string;
    DATE_TIME_FORMAT: string;
    DATE_TIME_HM_FORMAT: string;
    local: EnvConfig;
    migrations: EnvConfig;
  }
}