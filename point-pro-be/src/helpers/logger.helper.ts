import chalk from 'chalk';
import { appDayjs } from './dayjs.helper';

enum LogType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  FATAL = 'FATAL',
}

type LoggerMessage = string | Error;

const logTypeColor: { [key in keyof typeof LogType]: chalk.Chalk } = {
  INFO: chalk.bgBlue,
  WARN: chalk.bgYellow,
  ERROR: chalk.bgRed,
  TRACE: chalk.bgGray,
  DEBUG: chalk.bgGreen,
  FATAL: chalk.bgRedBright,
};

const logMessageColor: { [key in keyof typeof LogType]: chalk.Chalk } = {
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red,
  TRACE: chalk.gray,
  DEBUG: chalk.green,
  FATAL: chalk.redBright,
};

export class Logger {
  static log(type: LogType, message: LoggerMessage) {
    const now = appDayjs().tz('Asia/Taipei').format();
    message = message instanceof Error ? `${message.name} ${message.message} ${message.stack}` : message;
    console.log(`[${logTypeColor[type](type)}] ${logMessageColor[type](`${message} [${now}]`)}`);
  }

  static info(message: LoggerMessage) {
    Logger.log(LogType.INFO, message);
  }
  static warn(message: LoggerMessage) {
    Logger.log(LogType.WARN, message);
  }
  static error(message: LoggerMessage) {
    Logger.log(LogType.ERROR, message);
  }
  static fatal(message: LoggerMessage) {
    Logger.log(LogType.FATAL, message);
  }
  static debug(message: LoggerMessage) {
    Logger.log(LogType.DEBUG, message);
  }
  static trace(message: LoggerMessage) {
    Logger.log(LogType.TRACE, message);
  }
}
