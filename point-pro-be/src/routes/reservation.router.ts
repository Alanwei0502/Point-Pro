import { Router } from 'express';
import { ReservationController } from '../controllers';
import { authMiddleware, validateMiddleware } from '../middlewares';
import { getReservationsRequestSchema, createReservationRequestSchema } from '../validators';

const reservationRouter = Router();

reservationRouter.get('/', authMiddleware, validateMiddleware(getReservationsRequestSchema, 'query'), ReservationController.getReservationsHandler);
reservationRouter.post('/', validateMiddleware(createReservationRequestSchema), ReservationController.createReservationHandler);
reservationRouter.patch(
  '/:reservationId',
  authMiddleware,
  validateMiddleware(createReservationRequestSchema),
  ReservationController.updateReservationHandler,
);
reservationRouter.patch('/:reservationId/start', authMiddleware, ReservationController.startDiningReservationHandler);
reservationRouter.delete('/:reservationId', ReservationController.deleteReservationHandler);

export default reservationRouter;
