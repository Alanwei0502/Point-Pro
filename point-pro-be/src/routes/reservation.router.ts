import { Router } from 'express';
import { ReservationController } from '../controllers';

const reservationRouter = Router();

reservationRouter.post('/', ReservationController.createReservationHandler);
reservationRouter.get('/', ReservationController.getReservationsHandler);
reservationRouter.get('/:reservationId', ReservationController.getReservationDetailsHandler);
reservationRouter.patch('/:reservationId', ReservationController.updateReservationHandler);

export default reservationRouter;
