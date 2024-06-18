import { OrderStatus, OrderType } from '@prisma/client';
import { z } from 'zod';

export const createPaymentRequestSchema = z.array(
  z.object({
    id: z.string().uuid(),
    type: z.nativeEnum(OrderType),
    status: z.nativeEnum(OrderStatus),
    totalPrice: z.number(),
    reservationId: z.union([z.string().uuid(), z.null()]),
    orderMeals: z.array(
      z.object({
        id: z.string().uuid(),
        amount: z.number(),
        servedAmount: z.number(),
        meals: z.object({
          id: z.string().uuid(),
          title: z.string(),
          imageId: z.string(),
          price: z.number(),
          isPopular: z.boolean(),
        }),
        orderMealSpecialtyItems: z.array(
          z.object({
            specialtyItems: z.object({
              id: z.string().uuid(),
              title: z.string(),
              price: z.number(),
            }),
          }),
        ),
      }),
    ),
  }),
);

export const confirmLinePayRequestSchema = z.object({
  transactionId: z.string(),
  paymentId: z.string(),
});

export const udpatePaymentStatusRequestSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});
