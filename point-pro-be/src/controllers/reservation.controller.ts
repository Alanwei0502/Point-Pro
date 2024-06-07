import { NextFunction, Request } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Prisma, ReservationType } from '@prisma/client';
import { date, number, object, string } from 'yup';
import { getDateOnly, ignoreUndefined, prismaClient } from '../helpers';
import { ApiResponse, AuthRequest } from '../types';
import { AuthService, PeriodService, ReservationService } from '../services';
import { v4 as uuidv4 } from 'uuid';
import { CreateRecord, CreateReservation, ReservationInfo, UpdateReservation } from '../types/reservation';
import { reservationModel, userModel } from '../models';

export class ReservationController {
  static getReservationByPhoneHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const { phone } = req.params;

      const [reservation] = await reservationModel.getReservationByUserPhone(phone);

      if (!reservation) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: ReasonPhrases.NOT_FOUND,
          result: null,
        });
      } else {
        const result = {
          username: reservation.username,
          gender: reservation.gender,
          phone: reservation.phone,
          email: reservation.email,
          people: reservation.reservations[0].people,
          remark: reservation.reservations[0].remark,
          period: {
            id: reservation.reservations[0].periods.id,
            startTime: reservation.reservations[0].periods.startTime,
          },
        };
        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          result,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  static createReservationHandler = async (req: Request, res: ApiResponse, next: NextFunction) => {
    try {
      const { username, gender, phone, email, role, periodId, remark, people, type } = req.body;
      const user = await userModel.createCustomerUser({ username, gender, phone, email, role });
      const reservation = await reservationModel.createReservation({ type, people, remark, periodId, userId: user.id });

      return res.status(StatusCodes.CREATED).json({
        message: ReasonPhrases.CREATED,
        result: reservation.id,
      });
    } catch (error) {
      next(error);
    }
  };

  // public static getReservationsHandler = async (req: AuthRequest, res: ApiResponse) => {
  //   const querySchema = object({
  //     date: date()
  //       .optional()
  //       .default(() => new Date()),
  //   });
  //   try {
  //     await querySchema.validate(req.query);
  //   } catch (error) {
  //     return res.status(400).json({
  //       message: 'invalid date format',
  //       result: null,
  //     });
  //   }

  //   try {
  //     const { date } = await querySchema.cast(req.query);
  //     let nextTargetDate = getDateOnly(date);
  //     nextTargetDate.setDate(nextTargetDate.getDate() + 1);

  //     console.log(date, nextTargetDate);

  //     const reservations = await prismaClient.reservationLog.findMany({
  //       where: {
  //         bookedSeats: {
  //           every: {
  //             period: {
  //               startedAt: {
  //                 gte: date,
  //                 lte: nextTargetDate,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       include: {
  //         bookedSeats: {
  //           include: {
  //             seat: true,
  //             period: true,
  //           },
  //         },
  //       },
  //     });

  //     // console.log(reservations);

  //     const sortedReservations = reservations
  //       .filter((reservation) => reservation.bookedSeats.length > 0)
  //       .sort((a, b) => {
  //         const startedAtA = a.bookedSeats.length > 0 ? a.bookedSeats[0].period.startedAt.valueOf() : 0;
  //         const startedAtB = b.bookedSeats.length > 0 ? b.bookedSeats[0].period.startedAt.valueOf() : 0;

  //         return startedAtA - startedAtB;
  //       });

  //     const result: ReservationInfo[] = sortedReservations.map((reservation) => {
  //       // console.log(reservation.bookedSeats[0]);
  //       return {
  //         id: reservation.id,
  //         reservedAt: reservation.reservedAt,
  //         type: reservation.type,
  //         status:
  //           reservation.startOfMeal && reservation.endOfMeal
  //             ? 'COMPLETED'
  //             : reservation.startOfMeal
  //             ? 'IN_USE'
  //             : 'NOT_ATTENDED',
  //         options: typeof reservation.options === 'object' && reservation.options ? reservation.options : {},
  //         periodStartedAt: reservation.bookedSeats[0].period.startedAt,
  //         periodEndedAt: reservation.bookedSeats[0].period.endedAt,
  //         startOfMeal: reservation.startOfMeal,
  //         endOfMeal: reservation.endOfMeal,
  //         seats: reservation.bookedSeats.map((seatRelation) => ({
  //           id: seatRelation.seat.id,
  //           seatNo: seatRelation.seat.prefix + '-' + seatRelation.seat.no,
  //           amount: seatRelation.seat.amount,
  //         })),
  //       };
  //     });
  //     // result.sort((a, b) => a.periodStartedAt?.valueOf() || 0 - (b.periodEndedAt?.valueOf() || 1));

  //     return res.status(200).json({
  //       message: 'successfully get reservations',
  //       result,
  //     });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       return res.status(400).json({
  //         message: error.message,
  //         result: null,
  //       });
  //     }
  //   }
  // };
  // public static getReservationDetailsHandler = async (req: AuthRequest, res: ApiResponse) => {
  //   const { reservationId } = req.params;
  //   try {
  //     const reservation = await prismaClient.reservationLog.findUnique({
  //       where: { id: reservationId },
  //       include: {
  //         bookedSeats: {
  //           include: {
  //             seat: true,
  //             period: true,
  //           },
  //         },
  //       },
  //     });

  //     const result: ReservationInfo | null = reservation && {
  //       id: reservation.id,
  //       reservedAt: reservation.reservedAt,
  //       type: reservation.type,
  //       status:
  //         reservation.startOfMeal && reservation.endOfMeal
  //           ? 'COMPLETED'
  //           : reservation.startOfMeal
  //           ? 'IN_USE'
  //           : 'NOT_ATTENDED',
  //       options: typeof reservation.options === 'object' && reservation.options ? reservation.options : {},
  //       periodStartedAt: reservation.bookedSeats[0].period.startedAt,
  //       periodEndedAt: reservation.bookedSeats[0].period.endedAt,
  //       startOfMeal: reservation.startOfMeal,
  //       endOfMeal: reservation.endOfMeal,
  //       seats: reservation.bookedSeats.map((seatRelation) => ({
  //         id: seatRelation.seat.id,
  //         seatNo: seatRelation.seat.prefix + '-' + seatRelation.seat.no,
  //         amount: seatRelation.seat.amount,
  //       })),
  //     };

  //     return res.status(200).json({
  //       message: 'successfully get reservation',
  //       result,
  //     });
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       return res.status(400).json({
  //         message: error.message,
  //         result: null,
  //       });
  //     }
  //   }
  // };
  // public static updateReservationHandler = async (req: AuthRequest, res: ApiResponse<UpdateReservation>) => {
  //   const inputSchema = object({
  //     options: object().optional(),
  //     startOfMeal: date().optional(),
  //     endOfMeal: date().optional(),
  //   });
  //   const { reservationId } = req.params;

  //   try {
  //     await inputSchema.validate(req.body);
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error as Error).message,
  //       result: null,
  //     });
  //   }
  //   const { options, startOfMeal, endOfMeal } = inputSchema.cast(req.body);

  //   try {
  //     const reservationLog = await prismaClient.reservationLog.findUniqueOrThrow({
  //       where: { id: reservationId },
  //     });

  //     const newReservation: Prisma.ReservationLogUpdateInput = {
  //       options:
  //         options === undefined
  //           ? reservationLog.options
  //           : typeof reservationLog.options === 'object'
  //           ? { ...reservationLog.options, ...options }
  //           : ignoreUndefined(options, reservationLog.options),
  //       startOfMeal: ignoreUndefined(startOfMeal, reservationLog.startOfMeal),
  //       endOfMeal: ignoreUndefined(endOfMeal, reservationLog.endOfMeal),
  //     };

  //     const updatedReservation = await prismaClient.reservationLog.update({
  //       where: {
  //         id: reservationId,
  //       },
  //       data: newReservation,
  //     });
  //     return res.status(200).json({
  //       message: 'UPDATE_RESERVATION',
  //       result: {
  //         id: updatedReservation.id,
  //         options: updatedReservation.options,
  //         startOfMeal: updatedReservation.startOfMeal,
  //         endOfMeal: updatedReservation.endOfMeal,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(400).json({
  //       message: (error as Error).message,
  //       result: null,
  //     });
  //   }
  // };
}
