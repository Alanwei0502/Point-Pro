import { z } from 'zod';
import { prismaClient } from '../helpers';
import { createOrderRequestSchema, getOrderRequestSchema } from '../validators';
import { Order, OrderMeal, OrderStatus } from '@prisma/client';

const getOrders = async (query: z.infer<typeof getOrderRequestSchema>) => {
  const orders = await prismaClient.order.findMany({
    where: {
      type: query.type,
      status: query.status,
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      },
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
      reservations: {
        include: {
          reservationPeriodSeats: {
            include: {
              periodSeats: true,
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

const createOrder = async (order: z.infer<typeof createOrderRequestSchema>) => {
  const createdOrder = await prismaClient.order.create({
    data: {
      type: order.type,
      totalPrice: order.totalPrice,
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

const getOrderByIdCheckIsCancellable = async (orderId: Order['id']) => {
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

const cancelOrder = async (orderId: Order['id']) => {
  const order = await prismaClient.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCEL,
    },
  });

  return order;
};

const updateOrderMealServedAmount = async (orderId: Order['id'], orderMeals: Pick<OrderMeal, 'id' | 'amount' | 'servedAmount'>[]) => {
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

export const OrderModel = {
  getOrders,
  createOrder,
  getOrderByIdCheckIsCancellable,
  cancelOrder,
  updateOrderMealServedAmount,
};
