import { NextFunction } from 'express';
import { ApiResponse, AuthRequest } from '../types/shared';
import { z } from 'zod';
import { OrderStatus, OrderType } from '@prisma/client';

export const specialtiesValidatedSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        price: z.number(),
      }),
    ),
  }),
);

export const orderMealsValidatedSchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
    price: z.number(),
    title: z.string(),
    servedAmount: z.number(),
    specialties: specialtiesValidatedSchema,
  }),
);

export const orderStatusValidatedSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const reservationValidatedSchema = z.object({
  reservationId: z.string().uuid(),
});

export const orderIdValidatedSchema = z.object({
  orderId: z.string().uuid(),
});

export const createOrderReqBodySchema = z.array(
  z.object({
    id: z.string(),
    amount: z.number(),
    price: z.number(),
    title: z.string(),
    servedAmount: z.number(),
    specialties: specialtiesValidatedSchema,
  }),
);

export const updateOrderReqBodySchema = z.object({
  id: z.string().uuid(),
  status: z.nativeEnum(OrderStatus),
  type: z.nativeEnum(OrderType),
  orderMeals: orderMealsValidatedSchema,
});

// TDOO
// export const getOrderHandlerValidation = (req: AuthRequest, res: ApiResponse, next: NextFunction) => {
//   try {
//     if (req.auth.role === 'MERCHANT') {
//       orderStatusValidatedSchema.validateSync(req.query);
//     }
//     if (req.auth.role === 'USER') {
//       reservationValidatedSchema.validateSync(req.auth);
//     }
//     next();
//   } catch (error) {
//     if (error instanceof Error) {
//       return res.status(400).send({
//         message: error.message,
//         result: [],
//       });
//     }
//   }
// };
