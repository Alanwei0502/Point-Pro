import { Request, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../types';
import { PeriodModel } from '../models/period.model';

export class PeriodController {
  static getAvailablePeriods = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const periods = await PeriodModel.getAvailablePeriods();

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: periods,
      });
    } catch (error) {
      next(error);
    }
  };
}
