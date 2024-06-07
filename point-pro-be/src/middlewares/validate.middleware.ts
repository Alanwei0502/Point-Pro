import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validateMiddleware<Z extends z.ZodTypeAny>(schema: Z, dataFrom: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[dataFrom] = schema.parse(req[dataFrom]);
      next();
    } catch (error) {
      next(error);
    }
  };
}
