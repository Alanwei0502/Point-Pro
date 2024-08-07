import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { MailService, SessionRedis, appDayjs, genderTranslate, jwt } from '../helpers';
import {
  ApiResponse,
  ICreateReservationRequest,
  IDeleteReservationRequest,
  IGetReservationsRequest,
  IStartDiningReservationRequest,
  IUpdateReservationRequest,
} from '../types';
import { ReservationModel } from '../models';
import { OrderStatus } from '@prisma/client';

export class ReservationController {
  static getReservationsHandler = async (req: IGetReservationsRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const reservations = await ReservationModel.getReservations(req.query);

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: reservations.map((reservation) => {
          const needToPayOrders = reservation.orders.filter((o) => o.status !== OrderStatus.CANCEL);
          const allOrdersPaid = needToPayOrders.every((o) => o.payments?.status === 'PAID');
          return { ...reservation, allOrdersPaid };
        }),
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

      return res.status(StatusCodes.CREATED).send({
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
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到此預約',
        });
      }

      // Check if reservation is already started
      if (reservation?.startAt) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: '此預約已經開始用餐',
        });
      }

      // Check if reservation is cancelled
      if (reservation?.isCancelled) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: '此預約已被取消',
        });
      }

      await ReservationModel.updateReservation(req.params.reservationId, req.body);

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };

  static startDiningReservationHandler = async (req: IStartDiningReservationRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const reservation = await ReservationModel.getReservationById(req.params.reservationId);

      // Check if reservation exists
      if (!reservation) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到此預約',
        });
      }

      if (!['Alan', 'Ben', 'Cindy'].includes(reservation.username ?? '')) {
        // Check if reservation is already started
        if (reservation?.startAt) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: ReasonPhrases.BAD_REQUEST,
            result: '此預約已經開始用餐',
          });
        }

        // Check if reservation is cancelled
        if (reservation?.isCancelled) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: ReasonPhrases.BAD_REQUEST,
            result: '此預約已被取消',
          });
        }

        // Check if reservation is in the future
        // Can start dining 10 minutes before reservation
        if (appDayjs().isBefore(appDayjs(reservation?.periods.startTime).add(-10, 'minutes'))) {
          return res.status(StatusCodes.BAD_REQUEST).send({
            message: ReasonPhrases.BAD_REQUEST,
            result: '此預約還未到用餐時間，最快可以提早10分鐘開始用餐',
          });
        }
      }

      // Update reservation start time
      const newReservation = await ReservationModel.startDiningResevation(reservation.id);

      // Create JWT token for reservation
      const token = await jwt.getDiningToken({
        id: newReservation.id,
        username: newReservation.username,
        people: newReservation.people,
        startAt: newReservation.startAt,
      });

      // Redis set token
      await SessionRedis.setSession('customer', newReservation.id, jwt.customerExpirationTime, token);

      const url = new URL(`${process.env.CLIENT_URL!}/menu`);
      const searchParams = new URLSearchParams({
        token,
        id: reservation.id,
        people: `${newReservation.people}`,
        startAt: `${newReservation.startAt}`,
      });
      url.search = searchParams.toString();
      const fullUrl = url.toString();

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: fullUrl,
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
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到此預約',
        });
      }

      await ReservationModel.deleteReservation(req.params.reservationId);

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };
}
