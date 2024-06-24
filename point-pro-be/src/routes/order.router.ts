import { Router } from 'express';
import { OrderController } from '../controllers';
import {
  createOrderRequestSchema,
  getOrderRequestSchema,
  updateOrderMealServedAmountPayloadSchema,
  getOrdersToCheckoutRequestSchema,
} from '../validators';
import { authMiddleware, validateMiddleware } from '../middlewares';

const orderRouter = Router();
orderRouter.use(authMiddleware);
orderRouter.get('/', validateMiddleware(getOrderRequestSchema, 'query'), OrderController.getOrdersHandler);
orderRouter.post('/', validateMiddleware(createOrderRequestSchema), OrderController.createOrderHandler);
orderRouter.patch('/:orderId/cancel', OrderController.cancelOrderHandler);
orderRouter.patch(
  '/:orderId/served-amount',
  validateMiddleware(updateOrderMealServedAmountPayloadSchema),
  OrderController.updateOrderMealServedAmountHandler,
);
orderRouter.get('/checkout', validateMiddleware(getOrdersToCheckoutRequestSchema, 'query'), OrderController.getOrdersToCheckoutHandler);
export default orderRouter;
