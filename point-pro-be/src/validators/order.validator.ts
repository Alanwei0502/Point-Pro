import { z } from 'zod';
import { OrderStatus, OrderType } from '@prisma/client';

// TODO
export const specialtiesValidatedSchema = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    type: z.string(),
    items: z.array(
      z.object({
        id: z.string().uuid(),
        title: z.string(),
        price: z.number(),
      }),
    ),
  }),
);

// TODO
export const orderMealsValidatedSchema = z.array(
  z.object({
    id: z.string().uuid(),
    amount: z.number(),
    price: z.number(),
    title: z.string(),
    servedAmount: z.number(),
    specialties: specialtiesValidatedSchema,
  }),
);

// TODO
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

// TODO
export const updateOrderReqBodySchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(OrderStatus),
  type: z.nativeEnum(OrderType),
  orderMeals: orderMealsValidatedSchema,
});
