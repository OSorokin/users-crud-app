import * as winston from 'winston';
import * as moment from 'moment';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { USERS_CRUD_APP_CONFIGURATION } from '../../typings';
import config from '../configuration';
require('winston-loggly-bulk');

export function getLogger(label: string): winston.LoggerInstance {
  try {
    if (fs.statSync(label).isFile()) {
      label = path.basename(label).replace(new RegExp('\.js$', 'gi'), '.ts');
    }
  } catch (_) {
  }

  const transports: winston.TransportInstance[] = [];
  config.env().log.transports.forEach(t => {
    switch (t.type) {

      case 'console':
        transports.push(consoleTransport(label, t.level));
        return;

      case 'loggly':
        transports.push(logglyTransport(label, t));
        return;

      default:
        return;
    }
  });

  return new (winston.Logger)({
    transports: transports
  });
}

function consoleTransport(label: string, level: USERS_CRUD_APP_CONFIGURATION.LogLevelType): winston.ConsoleTransportInstance {
  return new (winston.transports.Console)({
    label: label,
    level: level,
    colorize: true,
    timestamp: function () {
      return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
    },
    formatter: function (options) {
      const message: string = options.message != null
        ? options.message.replace(/[\r\n]+/gm, '\\n').replace(/\t+/g, '\\t')
        : '';
      const meta: string = (options.meta != null) && (Object.keys(options.meta).length > 0)
        ? '\t' + util.inspect(options.meta).replace(/[\r\n]+/gm, '\\n')
        : '';

      return '[' + options.timestamp() + ']\t' +
        '[' + options.level + ']\t' +
        '[' + options.label + ']\t' +
        message +
        meta;
    }
  });
}

function logglyTransport(label: string, transport: USERS_CRUD_APP_CONFIGURATION.LogTransport): winston.ConsoleTransportInstance {
  return new (winston.transports.Loggly)({
    token: transport.configuration.token,
    subdomain: transport.configuration.subdomain,
    tags: transport.configuration.tags,
    json: true,
    label: label,
    level: transport.level
  });
}