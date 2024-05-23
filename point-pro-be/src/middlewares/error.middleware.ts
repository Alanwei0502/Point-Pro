import { NextFunction, Request } from 'express';
import { ApiResponse } from '../types/shared';
import { StatusCodes } from 'http-status-codes';

export const errorMiddleware = (error: Error, req: Request, res: ApiResponse, next: NextFunction) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: `${error.name} ${error.message}`, result: null });
};
