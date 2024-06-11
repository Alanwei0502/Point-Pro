import { Router } from 'express';
import { PeriodController } from '../controllers';

const periodRouter = Router();

periodRouter.get('/available', PeriodController.getAvailablePeriods);

export default periodRouter;
