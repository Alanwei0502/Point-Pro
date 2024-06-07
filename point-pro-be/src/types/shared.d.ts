import { User } from '@prisma/client';
import { Response, Request } from 'express';
import { z } from 'zod';

declare global {
  namespace Express {
    interface Request {
      // auth: UserAuth | ReservationAuth;
      auth: UserAuth;
    }
  }
}

interface ResponseError extends Error {
  code?: number;
}

interface PeriodInfo {
  id: string;
  periodStartedAt: Date;
  periodEndedAt: Date;
  amount: number;
  available: number;
}

type DatePeriodInfo = {
  date: Date;
  periods: PeriodInfo[];
  totalAmount: number;
  totalAvailable: number;
};
