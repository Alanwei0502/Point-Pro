import session from 'express-session';

const oneDay = 1000 * 60 * 60 * 24;

export const sessionMiddleware = session({
  secret: 'point-pro',
  saveUninitialized: true,
  cookie: { maxAge: oneDay },
  resave: false,
});
