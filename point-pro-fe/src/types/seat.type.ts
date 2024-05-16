import { ReservationInfo, ReservationRecord } from "./book.type";

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  BOOKED = "BOOKED",
  INUSE = "INUSE"
}

export interface SeatInfo {
  id: string;
  seatNo: string;
  status: SeatStatus;
  date: Date;
  currentReservation: ReservationRecord;
  period: any;
}

export interface PartialSeat {
  id: string;
  seatNo: string;
  amount: number;
}

export interface SeatDetailsPeriod {
  id: string;
  startedAt: Date;
  endedAt: Date;
  status: SeatStatus;
  reservation: ReservationInfo | null;
}

export interface SeatDetails {
  id: string;
  seatNo: string;
  date: Date;
  periods: SeatDetailsPeriod[];
}

export type SeatReservationInfo = {
  seatNo: string;
  status: SeatStatus;
  details: ReservationInfo[];
};
