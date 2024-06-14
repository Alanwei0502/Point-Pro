import { Router } from 'express';
import { ReservationController } from '../controllers';
import { authMiddleware, validateMiddleware } from '../middlewares';
import {
  getReservationsRequestSchema,
  createReservationRequestSchema,
  updateReservationRequestSchema,
  deleteReservationRequestSchema,
} from '../validators';

const reservationRouter = Router();

reservationRouter.get('/', authMiddleware, validateMiddleware(getReservationsRequestSchema, 'query'), ReservationController.getReservationsHandler);
reservationRouter.post('/', validateMiddleware(createReservationRequestSchema), ReservationController.createReservationHandler);
reservationRouter.patch(
  '/:reservationId',
  authMiddleware,
  validateMiddleware(updateReservationRequestSchema, 'params'),
  validateMiddleware(createReservationRequestSchema),
  ReservationController.updateReservationHandler,
);
reservationRouter.patch(
  '/:reservationId/start',
  authMiddleware,
  validateMiddleware(updateReservationRequestSchema, 'params'),
  ReservationController.startDiningReservationHandler,
);
reservationRouter.delete(
  '/:reservationId',
  validateMiddleware(deleteReservationRequestSchema, 'params'),
  ReservationController.deleteReservationHandler,
);

export default reservationRouter;
