import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
  ApiResponse,
  ICancelOrderRequest,
  IGetOrderRequest,
  IGetOrdersToCheckoutRequest,
  IPostOrderRequest,
  IUpdateOrderMealServedAmountRequest,
} from '../types';
import { OrderModel, PaymentModel } from '../models';
import { getRoleAndAuth } from '../helpers';
import { OrderStatus, OrderType } from '@prisma/client';

export class OrderController {
  static getOrdersHandler = async (req: IGetOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { role, auth } = getRoleAndAuth(req);
      const orders = await OrderModel.getOrders(req.query, role, auth);

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: orders,
      });
    } catch (error) {
      next();
    }
  };

  static createOrderHandler = async (req: IPostOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { role, auth } = getRoleAndAuth(req);
      const newOrder = await OrderModel.createOrder(req.body, role, auth);

      return res.status(StatusCodes.CREATED).send({
        message: ReasonPhrases.CREATED,
        result: newOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  static cancelOrderHandler = async (req: ICancelOrderRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // check if order is cancellable
      const order = await OrderModel.getOrderByIdCheckIsCancellable(req.params.orderId);

      // if order is not cancellable
      if (!order) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Order is not cancellable',
        });
      }

      // cancel order
      const result = await OrderModel.cancelOrder(order.id);

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateOrderMealServedAmountHandler = async (req: IUpdateOrderMealServedAmountRequest, res: ApiResponse, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { orderMeals } = req.body;

      // check if served amount is valid
      const isValidServedAmount = orderMeals.every((meal) => meal.amount >= meal.servedAmount);
      if (!isValidServedAmount) {
        return res.status(StatusCodes.BAD_REQUEST).send({
          message: ReasonPhrases.BAD_REQUEST,
          result: 'Served amount cannot be greater than amount',
        });
      }

      // update order meal served amount
      const result = await OrderModel.updateOrderMealServedAmount(orderId, orderMeals);
      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result,
      });
    } catch (error) {
      next(error);
    }
  };

  static getOrdersToCheckoutHandler = async (req: IGetOrdersToCheckoutRequest, res: ApiResponse, next: NextFunction) => {
    try {
      // check if dine in or take out
      const orders = await OrderModel.getOrdersToCheckout(req.query);
      let msg = '';

      if (!orders.length) {
        msg = '無點餐紀錄';
      } else if (orders.every((o) => o.status === OrderStatus.CANCEL)) {
        msg = '所有餐點已取消';
      } else if (req.query.type === OrderType.DINE_IN && orders.some((o) => o.status === OrderStatus.WORKING)) {
        msg = '尚有餐點未完成';
      } else if (orders.every((o) => o.paymentId)) {
        const payment = await PaymentModel.getPaymentById(orders[0].paymentId!);
        if (payment?.status === 'PAID') {
          msg = '餐點已付款';
        }
      }

      return res.status(StatusCodes.OK).send({
        message: ReasonPhrases.OK,
        result: {
          msg,
          orders,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
