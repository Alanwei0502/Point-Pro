import { IOrderMeal, OrderStatus, OrderType, BookingType, Gender, IBookingInfo } from "~/types";

export enum SocketTopic {
  MENU = "MENU",
  ORDER = "ORDER",
  RESERVATION = "RESERVATION"
}

export enum NameSpace {
  main = "/",
  user = "/user",
  admin = "/admin"
}

export enum OrderMessage {
  CREATE_ORDER = "CREATE_ORDER",
  UPDATE_ORDER = "UPDATE_ORDER",
  CANCEL_ORDER = "CANCEL_ORDER",
  PAY_ORDER = "PAY_ORDER"
}

export enum MenuMessage {
  CREATE_MEAL = "CREATE_MEAL",
  UPDATE_MEAL = "UPDATE_MEAL",
  DELETE_MEAL = "DELETE_MEAL"
}

export enum ReservationMessage {
  CREATE_RESERVATION = "CREATE_RESERVATION",
  UPDATE_RESERVATION = "UPDATE_RESERVATION"
}

export interface INotification<NotiType extends SocketTopic, Message, Result> {
  notiType: NotiType;
  message: Message;
  result: Result;
}

export interface IOrderResult {
  id: string;
  type: OrderType;
  status: OrderStatus;
  parentOrderId: string | null;
  reservationId: string | null;
  createAt: string | null;
  updatedAt: string | null;
  orderMeals: IOrderMeal[];
  paymentLogs: [];
  seats?: string[];
  reservationsLogs: {
    id: string;
    options: Omit<IBookingInfo, "id" | "reservedAt">;
    bookedSeats: {
      seat: {
        prefix: string;
        no: number;
      };
    }[];
  } | null;
}

export interface IMenuResult {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  isPopular: boolean;
  publishedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  categories: any[];
  specialties: any[];
}

export interface IReservationResult {
  id: string;
  reservedAt: string;
  type: BookingType;
  options: {
    name: string;
    gender: Gender;
    type: BookingType;
    phone: string;
    email: string;
    remark: string;
    adults: number;
    children?: number;
  };
  periodStartedAt: string;
  periodEndedAt: string;
  seats: {
    id: string;
    seatNo: string;
    amount: number;
  }[];
  token?: string;
}

export type OrderNotification = INotification<SocketTopic.ORDER, OrderMessage, IOrderResult>;
export type MenuNotification = INotification<SocketTopic.MENU, MenuMessage, IMenuResult>;
export type ReservationNotification = INotification<SocketTopic.RESERVATION, ReservationMessage, IReservationResult>;
