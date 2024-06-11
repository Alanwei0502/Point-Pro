import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Prisma, ReservationType } from '@prisma/client';
import { date, number, object, string } from 'yup';
import { MailService, appDayjs, genderTranslate, getDateOnly, ignoreUndefined, prismaClient } from '../helpers';
import {
  ApiResponse,
  AuthRequest,
  ICreateReservationRequest,
  IDeleteReservationRequest,
  IGetReservationsRequest,
  IUpdateReservationRequest,
} from '../types';
import { AuthService, PeriodService } from '../services';
import { v4 as uuidv4 } from 'uuid';
import { ReservationModel, UserModel } from '../models';

export class ReservationController {
  static getReservationsHandler = async (req: IGetReservationsRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const reservations = await ReservationModel.getReservations(req.query);

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        result: reservations,
      });
    } catch (error) {
      next(error);
    }
  };

  static createReservationHandler = async (req: ICreateReservationRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const reservation = await ReservationModel.createReservation(req.body);

      if (reservation.email) {
        MailService.sendMail(
          'reservationConfirm',
          {
            username: reservation.username,
            gender: genderTranslate[reservation.gender],
            people: reservation.people,
            remark: reservation.remark,
            time: appDayjs(reservation.periods.startTime).format('YYYY-MM-DD HH:mm'),
          },
          {
            to: reservation.email,
          },
        );
      }

      return res.status(StatusCodes.CREATED).json({
        message: ReasonPhrases.CREATED,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateReservationHandler = async (req: IUpdateReservationRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // Check if reservation exists
      const reservation = await ReservationModel.getReservationById(req.params.reservationId);

      if (!reservation) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      }

      await ReservationModel.updateReservation(req.params.reservationId, req.body);

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteReservationHandler = async (req: IDeleteReservationRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // Check if reservation exists
      const reservation = await ReservationModel.getReservationById(req.params.reservationId);

      if (!reservation) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      }

      await ReservationModel.deleteReservation(req.params.reservationId);

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };
}
