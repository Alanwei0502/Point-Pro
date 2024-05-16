import { OrderMeal } from "~/features/orders/type";
import { OrderStatus, OrderType } from "./order.type";
import { BookingType, Gender, IBookingInfo } from "./book.type";

export enum SocketTopic {
  MENU = "MENU",
  ORDER = "ORDER",
  RESERVATION = "RESERVATION"
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

export interface INotification<Message, Result> {
  notiType: SocketTopic;
  message: Message;
  result: Result;
}

export interface IOrderResult {
  id: string;
  type: OrderType;
  status: OrderStatus;
  parentOrderId: string | null;
  reservationLogId: string | null;
  createAt: string | null;
  updatedAt: string | null;
  orderMeals: OrderMeal[];
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

export type OrderNotification = INotification<OrderMessage, IOrderResult>;
export type MenuNotification = INotification<MenuMessage, IMenuResult>;
export type ReservationNotification = INotification<ReservationMessage, IReservationResult>;
