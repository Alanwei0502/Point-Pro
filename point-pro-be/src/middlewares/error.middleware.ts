import { NextFunction, Request } from 'express';
import { ApiResponse } from '../types/shared';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const errorMiddleware = (error: Error, req: Request, res: ApiResponse, next: NextFunction) => {
  console.error(error);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: ReasonPhrases.INTERNAL_SERVER_ERROR, result: `${error.name} ${error.message}` });
};
