import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiResponse, AuthRequest } from '../types';
import { SeatModel } from '../models/seat.model';

export class SeatController {
  static getSeatsHandler = async (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const seats = await SeatModel.getSeats();
      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: seats,
      });
    } catch (error) {
      next(error);
    }
  };
}
