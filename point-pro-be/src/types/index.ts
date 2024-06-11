export * from './handler.type';

export interface ResponseError extends Error {
  code?: number;
}

export interface PeriodInfo {
  id: string;
  periodStartedAt: Date;
  periodEndedAt: Date;
  amount: number;
  available: number;
}

export type DatePeriodInfo = {
  date: Date;
  periods: PeriodInfo[];
  totalAmount: number;
  totalAvailable: number;
};
