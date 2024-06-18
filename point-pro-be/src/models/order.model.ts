import { z } from 'zod';
import { prismaClient } from '../helpers';
import { createOrderRequestSchema, getOrderRequestSchema, getOrdersToCheckoutRequestSchema } from '../validators';
import { Order, OrderMeal, OrderStatus, OrderType, Reservation } from '@prisma/client';
import { AuthInfo } from '../types';

export class OrderModel {
  static getOrders = async (query: z.infer<typeof getOrderRequestSchema>, role: AuthInfo['role'], auth: AuthInfo['auth']) => {
    const orders = await prismaClient.order.findMany({
      where: {
        type: query.type,
        status: query.status,
        reservationId: role === 'admin' ? undefined : auth.id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
        },
      },
      include: {
        payments: true,
        orderMeals: {
          select: {
            id: true,
            amount: true,
            servedAmount: true,
            meals: {
              select: {
                id: true,
                imageId: true,
                isPopular: true,
                price: true,
                title: true,
              },
            },
            orderMealSpecialtyItems: {
              select: {
                specialtyItems: {
                  select: {
                    id: true,
                    price: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  };

  static createOrder = async (order: z.infer<typeof createOrderRequestSchema>, role: AuthInfo['role'], auth: AuthInfo['auth']) => {
    const createdOrder = await prismaClient.order.create({
      data: {
        type: order.type,
        totalPrice: order.totalPrice,
        reservationId: role === 'admin' ? undefined : auth.id,
        orderMeals: {
          create: order.orderMeals.map((m) => ({
            amount: m.amount,
            mealId: m.id,
            orderMealSpecialtyItems: {
              create: m.specialtyItems.map((str) => ({ specialtyItemId: str })),
            },
          })),
        },
      },
    });

    return createdOrder;
  };

  static getOrderByIdCheckIsCancellable = async (orderId: Order['id']) => {
    const order = await prismaClient.order.findUnique({
      where: {
        id: orderId,
        status: {
          equals: OrderStatus.WORKING,
        },
        orderMeals: {
          every: {
            servedAmount: {
              equals: 0,
            },
          },
        },
      },
    });

    return order;
  };

  static cancelOrder = async (orderId: Order['id']) => {
    const order = await prismaClient.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.CANCEL,
      },
    });

    return order;
  };

  static updateOrderMealServedAmount = async (orderId: Order['id'], orderMeals: Pick<OrderMeal, 'id' | 'amount' | 'servedAmount'>[]) => {
    const isFinished = orderMeals.every((m) => m.amount === m.servedAmount);

    const updatedOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: {
        status: isFinished ? OrderStatus.FINISHED : OrderStatus.WORKING,
        orderMeals: {
          updateMany: orderMeals.map((m) => ({
            where: {
              id: m.id,
            },
            data: {
              servedAmount: m.servedAmount,
            },
          })),
        },
      },
    });

    return updatedOrder;
  };

  static getOrdersToCheckout = async (params: z.infer<typeof getOrdersToCheckoutRequestSchema>) => {
    const { id, reservationId, type } = params;

    const orders = await prismaClient.order.findMany({
      where: {
        id,
        reservationId,
        type,
      },
      include: {
        orderMeals: {
          select: {
            id: true,
            amount: true,
            servedAmount: true,
            meals: {
              select: {
                id: true,
                imageId: true,
                isPopular: true,
                price: true,
                title: true,
              },
            },
            orderMealSpecialtyItems: {
              select: {
                specialtyItems: {
                  select: {
                    id: true,
                    price: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders;
  };
}
