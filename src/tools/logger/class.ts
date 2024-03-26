import config from '#config'
import Config from '@src/config.type.js';
import { Chalk } from 'chalk'
import emoji from '@tools/emoji/index.js'
import gradient from 'gradient-string'
import terminalLink from 'terminal-link'
import spinner from './spinner.js'
import fecha from 'fecha'
import winston, { Logger as logger } from 'winston'
import 'winston-daily-rotate-file'

export default class Logger {
  config: Config["logger"] = config.logger;
  chalk = new Chalk();
  getTimestamp = () => {
    return fecha.format(new Date(), this.config.dateFormat);
  }
  getRoot = (timestamp?: string) => {
    if (!timestamp) {
      timestamp = this.getTimestamp();
    }
    return this.setRooterColor(`[${timestamp}][${config.platform.name}]:`);
  };
  setRooterColor = (string: string) => {
    return gradient({h: 270, s: 100, v: 100, a: 100}, {h: 180, s: 100, v: 100, a: 100})(string, {interpolation: 'hsv', hsvSpin: 'long'});
  }
  getColor = (level: string, bg?: boolean) => {
    switch (level) {
      case "error":
        return bg?this.chalk.bgRed:this.chalk.red;
      case "warn":
        return bg?this.chalk.bgYellow:this.chalk.yellow;
      case "info":
        return bg?this.chalk.bgBlue:this.chalk.blue;
      case "http":
        return bg?this.chalk.bgCyan:this.chalk.cyan;
      case "verbose":
        return bg?this.chalk.bgWhite:this.chalk.white;
      case "debug":
        return bg?this.chalk.bgGray:this.chalk.gray;
      default:
        return bg?this.chalk.bgGreen:this.chalk.green;
    }
  }
  getSymbol = (level: string) => {
    switch (level) {
      case "error":
        return `${this.getColor(level)(emoji.char.cross)} ${this.getColor(level, true)(' ERROR ')} `;
      case "silly":
        return `${this.getColor(level)(emoji.char.tick)} `;
      default:
        return "";
    }
  }
  formatConsole = () => {
    return winston.format.printf((log) => {
      return `${this.getRoot()} ${log.pre?log.pre:""}${this.getSymbol(log.level)}${this.getColor(log.level)(log.message)}`;
    })
  }
  formatFile = () => {
    return winston.format.printf((log) => `[${this.getTimestamp()}][${log.level.toUpperCase()}] \t${log.pre?log.pre:""}${log.message}`);
  }
  logger: logger = winston.createLogger({
    silent: this.config.silent,
    level: this.config.level,
    handleExceptions: true,
    exitOnError: true,
    format: this.formatFile(),
    transports: [
      new winston.transports.Console({
        format: this.formatConsole(),
        handleExceptions: true,
      }),
      new winston.transports.DailyRotateFile({
        silent: this.config.fileSlient,
        level: this.config.fileLevel,
        dirname: this.config.path,
        filename: "%DATE%.log",
        datePattern: this.config.fileNameDateFormat,
        zippedArchive: false,
        maxSize: this.config.maxSize,
        maxFiles: this.config.maxFiles,
        handleExceptions: true,
      }),
    ],
  });
  log = (message: string, level?: string, callback?: winston.LogCallback) => {
    if (!level) level = this.config.defaultLevel;
    return this.logger.log(level, message, callback);
  }
  error = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.error(message, meta, callback);
  }
  warn = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.warn(message, meta, callback);
  }
  info = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.info(message, meta, callback);
  }
  http = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.http(message, meta, callback);
  }
  verbose = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.verbose(message, meta, callback);
  }
  debug = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.debug(message, meta, callback);
  }
  silly = (message: string, meta?: any, callback?: winston.LogCallback) => {
    return this.logger.silly(message, meta, callback);
  }
  link = (text: string, url: string) => {
    return this.logger.http(terminalLink(text, url, {
      fallback: (text, url) => `- ${text}: ${url}`
    }));
  }
  spinnerStart = (pre:string, message: string) => {
    spinner.prefixText = `${this.getRoot()}${pre}`;
    return spinner.start(this.setRooterColor(message));
  }
  spinnerStop = (level: Config["logger"]["level"], pre:string, message: string) => {
    spinner.stop();
    return this.logger[level](message, {
      pre: pre,
    });
  }
  spinnerPromise = async (pre: string, start:string, success: string, fail: string, promise: PromiseLike<unknown>) => {
    this.spinnerStart(pre, start);
    return promise.then(() => {
      this.spinnerStop(this.config.successLevel, pre, success);
    }, (error) => {
      this.spinnerStop(this.config.failLevel, pre, fail);
      this.error(error, {
        pre: pre,
      });
      throw error;
    });
  }
}