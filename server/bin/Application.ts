import * as env from '../app/configuration/env';
import * as http from 'http';
import * as util from 'util';
import config from '../app/configuration';
import Context from '../app/Context';
import WebServer from '../app/WebServer';
const logger = require('../app/logger/logger').getLogger(__filename);

export default class Application {

  private static normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  }

  public static async start(): Promise <void> {
    env.throwExceptionIfInvalidEnv();
    logger.info(`Application starting. Environment mode is: ${config.getMode()}`);

    await Context.init();

    const webServer = await WebServer.createWebServer();

    const port = Application.normalizePort(config.env().server.port);

    webServer.set('port', port);

    const server = http.createServer(webServer);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          logger.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;

        case 'EADDRINUSE':
          logger.error(bind + ' is already in use');
          process.exit(1);
          break;

        default:
          throw error;
      }
    }

    function onListening() {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      logger.info(`Webserver started. Listening on: ${bind}.`);
    }
  }
}

Application.start()
  .catch((e) => {
    logger.error(`Application did not start.\n${util.inspect(e)}`);
    process.exit(1);
  });
