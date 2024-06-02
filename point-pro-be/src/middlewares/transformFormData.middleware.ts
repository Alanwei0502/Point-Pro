import { NextFunction, Request, Response } from 'express';

export const createMealTransformFormDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body.price = req.body.price ? Number(req.body.price) : 0;
  req.body.position = Number(req.body.position);
  req.body.isPopular = req.body.isPopular === 'true';
  req.body.publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt).toISOString() : null;
  req.body.specialtyItems = req.body.specialtyItems && Array.isArray(req.body.specialtyItems) ? req.body.specialtyItems : [];
  next();
};

export const updateMealTransformFormDataMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body.price = req.body.price ? Number(req.body.price) : 0;
  req.body.isPopular = req.body.isPopular === 'true';
  req.body.publishedAt = req.body.publishedAt ? new Date(req.body.publishedAt).toISOString() : null;
  req.body.specialtyItems = req.body.specialtyItems && Array.isArray(req.body.specialtyItems) ? req.body.specialtyItems : [];
  next();
};
