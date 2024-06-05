import { Router } from 'express';
import { OrderController } from '../controllers';
import {
  updateOrderReqBodySchema,
  orderIdValidatedSchema,
  createOrderRequestSchema,
  getOrderRequestSchema,
  updateOrderMealServedAmountPayloadSchema,
} from '../validators';
import { validateMiddleware } from '../middlewares';

const orderRouter = Router();

orderRouter.get('/', validateMiddleware(getOrderRequestSchema, 'query'), OrderController.getOrdersHandler);
orderRouter.post('/', validateMiddleware(createOrderRequestSchema), OrderController.createOrderHandler);
orderRouter.patch('/:orderId/cancel', validateMiddleware(orderIdValidatedSchema, 'params'), OrderController.cancelOrderHandler);
orderRouter.patch(
  '/:orderId/served-amount',
  validateMiddleware(orderIdValidatedSchema, 'params'),
  validateMiddleware(updateOrderMealServedAmountPayloadSchema),
  OrderController.updateOrderMealServedAmountHandler,
);
// orderRouter.patch('/', validateMiddleware(updateOrderReqBodySchema), OrderController.updateOrderHandler);
export default orderRouter;
