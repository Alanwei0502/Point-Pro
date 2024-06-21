import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { PaymentGateway, PaymentStatus } from '@prisma/client';
import { ApiResponse, IConfirmLinePayRequest, ICreatePaymentRequest, IUpdatePaymentStatusRequest } from '../types';
import { PaymentModel } from '../models';
import { LinePayClient, Logger } from '../helpers';

export class PaymentController {
  static cashPaymentHandler = async (req: ICreatePaymentRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const payment = await PaymentModel.createPayment(req.body, PaymentGateway.CASH);
      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: payment,
      });
    } catch (error) {
      next(error);
    }
  };

  static linePayRequestHandler = async (req: ICreatePaymentRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // create unpaid payment
      const payment = await PaymentModel.createPayment(req.body, PaymentGateway.LINE_PAY);

      // request linepay payment
      const linePayRes = await LinePayClient.requestPayment(payment, req);

      res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: { ...linePayRes, paymentId: payment.id },
      });
    } catch (error) {
      next(error);
    }
  };

  static linePayConfirmHandler = async (req: IConfirmLinePayRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { paymentId, transactionId } = req.query;
      // Check if the payment is already paid
      const payment = await PaymentModel.getPaymentById(paymentId);
      if (!payment) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到付款紀錄',
        });
      }

      // Check if the payment is already completed
      const linePayRes = await LinePayClient.confirmRequest(payment.price, transactionId);

      if (linePayRes?.returnCode !== '0000') {
        Logger.error(`linePayRes: ${JSON.stringify(linePayRes)}`);
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: '確認失敗',
        });
      }

      // Update payment status
      await PaymentModel.updatePaymentStatus(paymentId, transactionId, PaymentStatus.PAID);

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: '確認成功',
      });
    } catch (error) {
      next(error);
    }
  };

  static patchPaymentStatusHandler = async (req: IUpdatePaymentStatusRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Check if the payment is already paid
      const payment = await PaymentModel.getPaymentById(id);
      if (!payment) {
        return res.status(StatusCodes.NOT_FOUND).send({
          message: ReasonPhrases.NOT_FOUND,
          result: '找不到付款紀錄',
        });
      }

      if (payment.status === PaymentStatus.PAID) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: '付款已完成',
        });
      }

      // Update payment status
      await PaymentModel.updatePaymentStatus(id, null, status);

      res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: '更新成功',
      });
    } catch (error) {
      next(error);
    }
  };
}
