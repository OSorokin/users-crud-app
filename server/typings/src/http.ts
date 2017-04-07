import * as express from 'express';

export namespace USERS_CRUD_APP_HTTP {

  export interface Next extends express.NextFunction {
  }

  export interface Response extends express.Response {
  }

  export interface Request extends express.Request {
  }

}