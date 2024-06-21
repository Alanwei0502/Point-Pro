import morgan from 'morgan';
import chalk from 'chalk';

morgan.token('status', (req, res) => {
  const status = res.statusCode;
  if (status >= 500) {
    return chalk.red(status);
  } else if (status >= 400) {
    return chalk.yellow(status);
  } else if (status >= 300) {
    return chalk.cyan(status);
  } else {
    return chalk.green(status);
  }
});

morgan.token('method', (req, res) => {
  const method = req.method;
  if (method === 'GET') {
    return chalk.green(method);
  } else if (method === 'POST') {
    return chalk.blue(method);
  } else if (method === 'PUT') {
    return chalk.yellow(method);
  } else if (method === 'DELETE') {
    return chalk.red(method);
  } else if (method === 'PATCH') {
    return chalk.magenta(method);
  } else {
    return chalk.gray(method);
  }
});

morgan.token('url', (req, res) => {
  return chalk.cyanBright(req.url);
});

export const morganMiddleware = morgan(':remote-addr :date[iso] :status :method :url :response-time ms - :res[content-length]');
