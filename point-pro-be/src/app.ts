import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorMiddleware, verifyMiddleware, sessionMiddleware } from './middleware';
import apiRouter from './routes';
import { corsOptionDelegate } from './helpers';

const app = express();

app.use(morgan('combined'));
app.use(cors(corsOptionDelegate));
app.use(cookieParser());

app.get('/healthz', async (_, res) => {
  return res.send(new Date().toISOString() + ' health check');
});

app.use(sessionMiddleware);
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(
  '/api',
  // verifyMiddleware([
  //   '/auth/login',
  //   '/auth/register',
  //   '/menu',
  //   '/period',
  //   '/period/list',
  //   '/reservation',
  //   '/mail',
  //   '/mail/verify',
  // ]),
  apiRouter,
);

app.use(errorMiddleware);

process.on('uncaughtException', (err) => {
  console.error('Uncaughted Exception!');
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection:', promise, '原因：', reason);
});

export default app;
