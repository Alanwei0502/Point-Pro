import { BookingType } from "./book.type";

export enum MemberRole {
  MERCHANT = "MERCHANT",
  CUSTOMER = "CUSTOMER"
}

export interface Member {
  id: string;
  account: string;
  email: string;
  name: string;
  role: MemberRole;
}

export interface UserInfo {
  periodEndTime: string;
  periodStartTime: string;
  seatNo: string;
  startTime: string;
  reservationType: BookingType;
  reservationId: string;
  iat: number;
  exp: number;
  role: "USER";
}
