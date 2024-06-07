import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { ApiResponse } from '../types';
import { Logger } from '../helpers';

export const errorMiddleware = (error: Error, req: Request, res: ApiResponse, next: NextFunction) => {
  Logger.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      result: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      result: error.message,
    });
  }

  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue: any) => ({
      message: `${issue.path.join('.')} is ${issue.message}`,
    }));
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: ReasonPhrases.BAD_REQUEST,
      result: errorMessages,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    result: `${error.name} ${error.message}`,
  });
};
