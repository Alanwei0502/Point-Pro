import { Router } from 'express';
import { SeatController } from '../controllers';
import { authMiddleware } from '../middlewares';

const seatRouter = Router();
seatRouter.use(authMiddleware);
seatRouter.get('/', SeatController.getSeatsHandler);

export default seatRouter;
