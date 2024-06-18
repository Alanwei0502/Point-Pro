import { Router } from 'express';
import { PaymentController } from '../controllers';
import { authMiddleware, validateMiddleware } from '../middlewares';
import { confirmLinePayRequestSchema, createPaymentRequestSchema, udpatePaymentStatusRequestSchema } from '../validators';

const paymentRouter = Router();
paymentRouter.post('/cash/request', authMiddleware, validateMiddleware(createPaymentRequestSchema), PaymentController.cashPaymentHandler);
paymentRouter.post('/line-pay/request', authMiddleware, validateMiddleware(createPaymentRequestSchema), PaymentController.linePayRequestHandler);
paymentRouter.get('/line-pay/confirm', validateMiddleware(confirmLinePayRequestSchema, 'query'), PaymentController.linePayConfirmHandler);
// paymentRouter.get('/line-pay/cancel/:orderId', PaymentController.linePayRefundHandler);
paymentRouter.patch('/:id', authMiddleware, validateMiddleware(udpatePaymentStatusRequestSchema), PaymentController.patchPaymentStatusHandler);

export default paymentRouter;
