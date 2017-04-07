import 'reflect-metadata';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { useExpressServer } from 'routing-controllers';
import * as Morgan from './logger/morgan-logger';
import { USERS_CRUD_APP_HTTP } from '../typings/src/http';

export default class WebServer {

  public static createWebServer(): express.Express {

    const expressServer: any = express();
    expressServer.use(compression());
    expressServer.use(Morgan.logger);
    expressServer.use(cors());
    expressServer.use(bodyParser.json());
    expressServer.use(bodyParser.urlencoded({extended: false}));
    expressServer.use(cookieParser());
    const server = useExpressServer(expressServer, {
      controllerDirs: [__dirname + '/controllers/*.js'],
      defaultErrorHandler: false,
    });

    WebServer.configureWebappFilesServing(server);

    return server;
  }

  private static configureWebappFilesServing(expressServer): void {

    expressServer.get('/*', (req: USERS_CRUD_APP_HTTP.Request, res: USERS_CRUD_APP_HTTP.Response, next: USERS_CRUD_APP_HTTP.Next) => {

      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

    });
  }
}
