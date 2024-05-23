import { Router } from 'express';
import { OrderController } from '../controllers';
import {
  createOrderReqBodySchema,
  updateOrderReqBodySchema,
  orderIdValidatedSchema,
  orderStatusValidatedSchema,
} from '../validators';
import { validateMiddleware } from '../middlewares';

const orderRouter = Router();

// orderRouter.get('/', validateMiddleware(orderStatusValidatedSchema, 'query'), OrderController.getOrdersHandler);
// orderRouter.post('/', validateMiddleware(createOrderReqBodySchema), OrderController.createOrderHandler);
// orderRouter.patch('/', validateMiddleware(updateOrderReqBodySchema), OrderController.updateOrderHandler);
// orderRouter.delete('/', validateMiddle(orderIdValidatedSchema, 'query'), OrderController.cancelOrderHandler);

export default orderRouter;
