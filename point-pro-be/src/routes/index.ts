import { Router } from 'express';
import authRouter from './auth.router';
import orderRouter from './order.router';
import menuRouter from './menu.router';
import periodRouter from './period.router';
import reservationRouter from './reservation.router';
import seatRouter from './seat.router';
import newsletterRouter from './newsletter.router';
import paymentRouter from './payment.router';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/order', orderRouter);
apiRouter.use('/menu', menuRouter);
apiRouter.use('/period', periodRouter);
apiRouter.use('/reservation', reservationRouter);
apiRouter.use('/seat', seatRouter);
apiRouter.use('/newsletter', newsletterRouter);
// apiRouter.use('/payment', paymentRouter);

export default apiRouter;
