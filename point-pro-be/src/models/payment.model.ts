import { z } from 'zod';
import { createPaymentRequestSchema } from '../validators';
import { prismaClient } from '../helpers';
import { Payment, PaymentGateway, PaymentStatus } from '@prisma/client';

export class PaymentModel {
  static getPaymentById = async (id: Payment['id']) => {
    const payment = await prismaClient.payment.findUnique({
      where: {
        id,
      },
    });

    return payment;
  };

  static createPayment = async (body: z.infer<typeof createPaymentRequestSchema>, gateway: PaymentGateway) => {
    const payment = await prismaClient.payment.create({
      data: {
        price: body.reduce((acc, curr) => acc + curr.totalPrice, 0),
        gateway,
        status: gateway === PaymentGateway.CASH ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        orders: {
          connect: [...body.map((order) => ({ id: order.id }))],
        },
      },
    });

    return payment;
  };

  static updatePaymentStatus = async (id: Payment['id'], paymentNo: Payment['paymentNo'], status: PaymentStatus) => {
    const payment = await prismaClient.payment.update({
      where: {
        id,
      },
      data: {
        paymentNo,
        status,
      },
    });

    return payment;
  };
}
