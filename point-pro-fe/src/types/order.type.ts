import { IBookingInfo } from "./book.type";
import { ICategory, IMeal, ISpecialty } from "./meal.type";

export enum OrderType {
  DineIn = "DineIn",
  TakeOut = "TakeOut"
}

export enum OrderStatus {
  PENDING = "PENDING",
  UNPAID = "UNPAID",
  SUCCESS = "SUCCESS",
  CANCEL = "CANCEL"
}

export enum OrderStatusTitle {
  PENDING = "準備中",
  UNPAID = "未付款",
  SUCCESS = "已付款",
  CANCEL = "已取消"
}

export enum PaymentGateway {
  LINE_PAY = "LINE_PAY",
  CASH = "CASH",
  EC_PAY = "EC_PAY"
}

export interface ICartItem {
  id: string;
  title: string;
  coverUrl: string;
  price: number;
  recommended: boolean;
  specialties: ISpecialty[];
  amount: number;
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  type: OrderType;
  reservationId: IBookingInfo["id"];
  createdAt: number;
  updatedAt: number;
  orderMeals: OrderMeal[];
  paymentLogs: IPaymentLog[];
}

export interface IPaymentLog {
  order: any;
  orderId: IOrder["id"];
  paymentNo: string;
  price: number;
  gateway: PaymentGateway;
  status: OrderStatus.UNPAID | OrderStatus.SUCCESS;
}

export interface OrderMeal {
  id: string;
  orderId: IOrder["id"];
  mealId: IMeal["id"];
  mealTitle: IMeal["title"];
  price: IMeal["price"];
  amount: number;
  servedAmount: number;
  isServed: boolean;
  specialties: ISpecialty[];
  categories: ICategory[];
  mealDetails?: string;
  meal?: IMeal;
}
