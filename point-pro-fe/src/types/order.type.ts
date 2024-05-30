import { IBookingInfo } from './book.type';
import { ICategory, IMeal, ISpecialty, OrderStatus, OrderType, PaymentStatus } from './common.type';

// export enum OrderStatus {
//   WORKING = 'WORKING',
//   UNPAID = 'UNPAID',
//   SUCCESS = 'SUCCESS',
//   CANCEL = 'CANCEL',
// }

export enum OrderStatusTitle {
  WORKING = '準備中',
  UNPAID = '未付款',
  SUCCESS = '已付款',
  CANCEL = '已取消',
}

export enum PaymentGateway {
  LINE_PAY = 'LINE_PAY',
  CASH = 'CASH',
  EC_PAY = 'EC_PAY',
}

export interface IPaymentLog {
  order: any;
  orderId: IOrder['id'];
  paymentNo: string;
  price: number;
  gateway: PaymentGateway;
  status: PaymentStatus;
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  type: OrderType;
  orderMeals: IOrderMeal[];
  paymentLogs: IPaymentLog[];
  seats?: string[];
  reservationId?: IBookingInfo['id'];
  createdAt?: number;
  updatedAt?: number;
}

export interface IOrderMeal {
  id: string;
  orderId: IOrder['id'];
  mealId: IMeal['id'];
  title: IMeal['title'];
  price: IMeal['price'];
  amount: number;
  servedAmount: number;
  isServed: boolean;
  specialties: ISpecialty[];
  categories: ICategory[];
  mealDetails?: string;
  meal?: IMeal;
  mealPrice: number;
}

export interface GatherOrder {
  id: string;
  status: OrderStatus;
  type: OrderType;
  seats: string[];
  paymentLogs: IPaymentLog[];
  orders: IOrder[];
  reservationId?: IBookingInfo['id'];
}
