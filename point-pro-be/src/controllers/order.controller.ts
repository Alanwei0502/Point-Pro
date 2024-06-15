import { NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ApiResponse, ICancelOrderRequest, IGetOrderRequest, IPostOrderRequest, IUpdateOrderMealServedAmountRequest } from '../types';
import { OrderModel } from '../models';
import { getRoleAndAuth } from '../helpers';

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
}
