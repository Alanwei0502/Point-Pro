import { BookingType, Gender } from './common.type';
import { PartialSeat } from './seat.type';

export interface IPeriod {
  id: string;
  startTime: Date;
  endTime: Date;
  available: number;
}

export interface CreateReservation {
  id: string;
  reservedAt: Date;
  options: { [key: string]: any };
  startTime: Date;
  endTime: Date;
  token: string;
  seats: PartialSeat[];
}

export interface DatePeriodInfo {
  date: Date;
  periods: IPeriod[];
  totalAmount: number;
  totalAvailable: number;
}

export interface ReservationRecord {
  periodId?: string;
  startedAt: Date;
  startOfMeal: Date | null;
  endOfMeal: Date | null;
  options?: { [key: string]: any };
}

export interface ReservationInfo {
  id: string;
  reservedAt: Date;
  type: BookingType;
  options: { [key: string]: any };
  startTime: Date;
  endTime: Date;
  startOfMeal: Date | null;
  endOfMeal: Date | null;
  seats: PartialSeat[];
  status: string;
}

export interface IBookingInfo {
  id: string;
  reservedAt: string;
  name: string;
  gender: Gender;
  type: BookingType;
  phone: string;
  email: string;
  remark: string;
  adults: number;
  children: number;
}

export interface IAvailableBookingPeriod {
  startTime: any;
  endTime: any;
  available: number;
}

export interface IAvailableBooking {
  date: number;
  availablePeriods: IAvailableBookingPeriod[];
}

export interface ICreateBookingParams {
  id: IBookingInfo['id'];
  reservedAt: IBookingInfo['reservedAt'];
  user: Omit<IBookingInfo, 'id' | 'reservedAt'>;
}
