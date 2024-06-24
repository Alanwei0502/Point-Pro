import { z } from 'zod';
import { OrderStatus, OrderType } from '@prisma/client';

export const orderIdValidatedSchema = z.object({
  orderId: z.string().uuid(),
});

export const getOrderRequestSchema = z.object({
  type: z.nativeEnum(OrderType).optional(),
  status: z.nativeEnum(OrderStatus).optional(),
});

export const createOrderRequestSchema = z.object({
  type: z.nativeEnum(OrderType),
  totalPrice: z.number(),
  orderMeals: z.array(
    z.object({
      id: z.string().uuid(),
      amount: z.number(),
      specialtyItems: z.array(z.string()),
    }),
  ),
});

export const updateOrderMealServedAmountPayloadSchema = z.object({
  orderMeals: z.array(
    z.object({
      id: z.string().uuid(),
      amount: z.number(),
      servedAmount: z.number(),
    }),
  ),
});

export const getOrdersToCheckoutRequestSchema = z.object({
  type: z.nativeEnum(OrderType),
  reservationId: z.string().optional(),
  orderId: z.string().optional(),
});
