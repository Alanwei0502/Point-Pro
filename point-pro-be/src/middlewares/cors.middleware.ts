import cors, { CorsOptions, CorsOptionsDelegate, CorsRequest } from 'cors';

const corsOptionDelegate: CorsOptionsDelegate = (req: CorsRequest, callback: (error: Error | null, options: CorsOptions) => void) => {
  const host = req.headers['host'];
  const origin = req.headers['origin'] || '';

  console.log('[[[[[[CORS]]]]]', new URL(origin));
  console.log('[[[[[PROCESS.ENV.CLIENT_URL]]]]]', new URL(process.env.CLIENT_URL!));

  if (!host || !origin) {
    callback(null, { credentials: false, origin: false });
    return;
  }

  if (process.env.NODE_ENV === 'development') {
    callback(null, { credentials: true, origin: true });
    return;
  }

  if (process.env.NODE_ENV === 'production' && new URL(origin).hostname === new URL(process.env.CLIENT_URL!).hostname) {
    callback(null, { credentials: true, origin: true });
    return;
  }

  callback(null, { credentials: false, origin: false });
};

export const corsMiddleware = cors(corsOptionDelegate);
