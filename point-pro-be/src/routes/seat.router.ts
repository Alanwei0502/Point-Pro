import { Router } from 'express';
import { SeatController } from '../controllers';
import { authMiddleware } from '../middlewares';

const seatRouter = Router();
seatRouter.use(authMiddleware);
seatRouter.get('/', SeatController.getSeatsHandler);
// seatRouter.get('/:seatIdOrNo', SeatController.getSeatHandler);

export default seatRouter;
