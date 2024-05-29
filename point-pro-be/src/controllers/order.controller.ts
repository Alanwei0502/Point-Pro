import { NextFunction, RequestHandler } from 'express';
import { OrderStatus, OrderType, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { ApiResponse, AuthRequest } from '../types/shared';
import { prismaClient } from '../helpers';
import {
  orderIdValidatedSchema,
  reservationValidatedSchema,
  createOrderReqBodySchema,
  orderStatusValidatedSchema,
  updateOrderReqBodySchema,
} from '../schemas';

const commonInclude: Prisma.OrderInclude<DefaultArgs> | null | undefined = {
  reservations: {
    select: {
      id: true,
      reservationPeriodSeats: {
        select: {
          periodSeats: {
            include: {
              seats: {
                select: {
                  seatNo: true,
                },
              },
            },
          },
        },
      },
    },
  },
  orderMeals: {
    include: {
      meals: {
        include: {
          categories: true,
        },
      },
    },
  },
  payments: true,
};

export class OrderController {
  // public static createOrderHandler: RequestHandler = async (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
  //   try {
  //     const { reservationId } = reservationValidatedSchema.cast(req.auth);
  //     const orderMeals = createOrderReqBodySchema.cast(req.body);
  //     const order = await prismaClient.order.create({
  //       data: {
  //         reservationId: reservationId,
  //         type: reservationId ? OrderType.DINE_IN : OrderType.TAKE_OUT,
  //       },
  //       // include: commonInclude,
  //     });
  //     // await prismaClient.orderMeal.createMany({
  //     //   data:
  //     // })
  //     // const result = {
  //     //   ...order,
  //     //   orderMeals:
  //     //     order.orderMeals.map(({ id, mealDetails, price, amount, servedAmount, meal }) => ({
  //     //       id,
  //     //       amount,
  //     //       servedAmount,
  //     //       price,
  //     //       mealPrice: meal.price,
  //     //       mealId: meal.id,
  //     //       title: meal.title,
  //     //       categories: meal.categories.map((category) => ({ ...category.category })),
  //     //       specialties: JSON.parse(mealDetails as string),
  //     //     })) ?? [],
  //     // };
  //     return res.status(201).send({
  //       message: 'CREATE_ORDER',
  //       result: {},
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  // public static getOrdersHandler: RequestHandler = async (req: AuthRequest, res: ApiResponse, next) => {
  //   if (req.auth.role === 'USER') {
  //     try {
  //       const { reservationId } = reservationValidatedSchema.cast(req.auth);
  //       const orders = await prismaClient.order.findMany({
  //         where: {
  //           reservationId: reservationId,
  //         },
  //         include: commonInclude,
  //       });
  //       const result = orders.map(({ orderMeals, ...rest }) => ({
  //         ...rest,
  //         orderMeals: orderMeals.map(({ id, mealDetails, price, amount, servedAmount, meal }) => ({
  //           id,
  //           amount,
  //           servedAmount,
  //           price,
  //           mealPrice: meal.price,
  //           mealId: meal.id,
  //           title: meal.title,
  //           categories: meal.categories.map((category) => ({ ...category.category })),
  //           specialties: JSON.parse(mealDetails as string), // [TODO] mealDetails type,
  //         })),
  //       }));
  //       return res.status(200).send({
  //         message: 'GET_ORDER',
  //         result,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //   if (req.auth.role === 'MERCHANT') {
  //     try {
  //       const { status } = orderStatusValidatedSchema.cast(req.query);
  //       const orders = await prismaClient.order.findMany({
  //         where: {
  //           status,
  //         },
  //         include: commonInclude,
  //       });
  //       const result = orders.map(({ orderMeals, reservationsLogs, ...rest }) => {
  //         // [TODO]: sibling seats?
  //         const seats = reservationsLogs?.bookedSeats?.map(
  //           (reservationSeat) => reservationSeat.seat.prefix + '-' + reservationSeat.seat.no,
  //         );
  //         return {
  //           ...rest,
  //           orderMeals: orderMeals.map(({ id, mealDetails, price, amount, servedAmount, meal }) => ({
  //             id,
  //             amount,
  //             servedAmount,
  //             price,
  //             mealPrice: meal.price,
  //             mealId: meal.id,
  //             title: meal.title,
  //             categories: meal.categories.map((category) => ({ ...category.category })),
  //             specialties: JSON.parse(mealDetails as string), // [TODO] mealDetails type,
  //           })),
  //           seats,
  //         };
  //       });
  //       return res.status(200).send({
  //         message: 'GET_ORDER',
  //         result,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // };
  // public static cancelOrderHandler: RequestHandler = async (req: AuthRequest, res: ApiResponse, next) => {
  //   try {
  //     const { orderId } = orderIdValidatedSchema.cast(req.query);
  //     const result = await prismaClient.order.update({
  //       where: { id: orderId },
  //       data: {
  //         status: OrderStatus.CANCEL,
  //       },
  //       include: commonInclude,
  //     });
  //     return res.status(200).send({
  //       message: 'CANCEL_ORDER',
  //       result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
  // public static updateOrderHandler: RequestHandler = async (req: AuthRequest, res: ApiResponse, next) => {
  //   try {
  //     const { id, status, orderMeals } = updateOrderReqBodySchema.cast(req.body);
  //     // are meals all served
  //     let isAllServed = true;
  //     orderMeals.forEach((meal) => {
  //       if (meal.amount !== meal.servedAmount) {
  //         isAllServed = false;
  //       }
  //     });
  //     // is order payment set
  //     const isPaid = await prismaClient.paymentLog.findFirst({
  //       where: {
  //         orderId: id,
  //       },
  //     });
  //     // is order cancelled
  //     const isCancelled = status === OrderStatus.CANCEL;
  //     // new status
  //     let newStatus: OrderStatus;
  //     if (isCancelled) {
  //       newStatus = OrderStatus.CANCEL;
  //     } else if (isAllServed && isPaid) {
  //       newStatus = OrderStatus.SUCCESS;
  //     } else if (isAllServed && !isPaid) {
  //       newStatus = OrderStatus.UNPAID;
  //     } else {
  //       newStatus = OrderStatus.PENDING;
  //     }
  //     const result = await prismaClient.$transaction(async (prisma) => {
  //       const updatedOrderLog = await prismaClient.order.update({
  //         where: { id },
  //         data: {
  //           status: newStatus,
  //         },
  //         include: commonInclude,
  //       });
  //       // [TODO] is looping the only way?
  //       for (const meal of orderMeals) {
  //         await prismaClient.orderMeal.update({
  //           where: { id: meal.id },
  //           data: {
  //             servedAmount: meal.servedAmount,
  //           },
  //         });
  //       }
  //       return updatedOrderLog;
  //     });
  //     return res.status(200).send({
  //       message: 'UPDATE_ORDER',
  //       result,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}
