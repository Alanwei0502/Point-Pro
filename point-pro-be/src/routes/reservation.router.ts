import { Router } from 'express';
import { ReservationController } from '../controllers';
import { validateMiddleware } from '../middlewares';
import { createReservationRequestBodySchema, findReservationByPhoneSchema } from '../validators';

const reservationRouter = Router();

reservationRouter.post(
  '/',
  validateMiddleware(createReservationRequestBodySchema, 'body'),
  ReservationController.createReservationHandler,
);
reservationRouter.get(
  '/:phone',
  validateMiddleware(findReservationByPhoneSchema, 'params'),
  ReservationController.getReservationByPhoneHandler,
);
// reservationRouter.get('/', ReservationController.getReservationsHandler);
// reservationRouter.get('/:reservationId', ReservationController.getReservationDetailsHandler);
// reservationRouter.patch('/:reservationId', ReservationController.updateReservationHandler);

export default reservationRouter;
