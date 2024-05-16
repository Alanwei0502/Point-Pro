import { PartialSeat } from "./seat.type";

export enum BookingType {
  ONLINE_BOOKING = "online-booking",
  PHONE_BOOKING = "phone-booking",
  WALK_IN_SEATING = "walk-in-seating"
}

export enum CustomerBookingDialog {
  RECORD_QUERY = "RECORD_QUERY",
  PRIVACY_POLICY = "PRIVACY_POLICY",
  REMINDER = "REMINDER",
  QRCODE = "QRCODE"
}

export enum Gender {
  MALE,
  FEMALE,
  OTHER
}

export interface PeriodInfo {
  id: string;
  periodStartedAt: Date;
  periodEndedAt: Date;
  amount: number;
  available: number;
}

export interface CreateReservation {
  id: string;
  reservedAt: Date;
  options: { [key: string]: any };
  periodStartedAt: Date;
  periodEndedAt: Date;
  token: string;
  seats: PartialSeat[];
}

export interface DatePeriodInfo {
  date: Date;
  periods: PeriodInfo[];
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
  periodStartedAt: Date;
  periodEndedAt: Date;
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
  periodStartedAt: any;
  periodEndedAt: any;
  available: number;
}

export interface IAvailableBooking {
  date: number;
  availablePeriods: IAvailableBookingPeriod[];
}

export interface ICreateBookingParams {
  id: IBookingInfo["id"];
  reservedAt: IBookingInfo["reservedAt"];
  user: Omit<IBookingInfo, "id" | "reservedAt">;
}
