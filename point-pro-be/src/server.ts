import 'dotenv/config';
import http from 'http';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { Logger, startSocketServer } from './helpers';
import apiRouter from './routes';
import { corsMiddleware, errorMiddleware, sessionMiddleware, rateLimiterMiddleware, morganMiddleware } from './middlewares';

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');

// Global Error Handler
process
  .on('uncaughtException', (err) => {
    console.error('未捕捉到的異常：', err);
    setTimeout(() => process.exit(1), 100);
  })
  .on('unhandledRejection', (reason, promise) => {
    console.error('未捕捉到的Promise錯誤：', promise, '原因：', reason);
    setTimeout(() => process.exit(1), 100);
  })
  .on('SIGINT', () => {
    Logger.info('close server');
    server.close(() => {
      Logger.info('kill Node process');
      process.exit(0);
    });
  });

const setUpMiddleware = () => {
  app
    // Middlewares
    .use(rateLimiterMiddleware)
    .use(morganMiddleware)
    .use(corsMiddleware)
    .use(cookieParser())
    .use(sessionMiddleware)
    .use(json())
    .use(urlencoded({ extended: true }))
    // Health Check
    .get('/healthz', async (_, res, next) => {
      try {
        res.send(new Date().toISOString() + ' health check');
      } catch (error) {
        Logger.error(`Health Check Error: ${error}`);
        next(error);
      }
    })
    // API Router
    .use('/api', apiRouter)
    // Error Handler
    .use(errorMiddleware);
};

const startServer = () => {
  const port = parseInt(process.env.PORT!);
  const host = process.env.NODE_ENV === 'development' ? process.env.HOSTNAME : undefined;

  server
    .on('error', (error) => {
      Logger.error(`Server ${error}`);
    })
    .listen(port, host, async () => {
      const addr = server.address();
      if (!addr) {
        return Logger.error('cannot get the address from server');
      }
      const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
      Logger.info(`Server is listening on ${bind}`);
    });
};

setUpMiddleware();
startServer();
startSocketServer(server);
