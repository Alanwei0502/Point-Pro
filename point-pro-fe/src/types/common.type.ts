import { GetMenuResponseMeal, GetMenuResponseSpecialtyItem } from './api.type';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum LoginType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum OrderStatus {
  WORKING = 'WORKING',
  FINISHED = 'FINISHED',
  CANCEL = 'CANCEL',
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_OUT = 'TAKE_OUT',
}

export enum PaymentGateway {
  LINE_PAY = 'LINE_PAY',
  CASH = 'CASH',
  EC_PAY = 'EC_PAY',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  CANCEL = 'CANCEL',
}

export enum ReservationType {
  ONLINE = 'ONLINE',
  PHONE = 'PHONE',
}

export enum Role {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export enum SelectionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export interface ICategory {
  id: string;
  title: string;
  position: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IMeal {
  id: string;
  title: string;
  description: string;
  isPopular: boolean;
  price: number;
  position: number;
  publishedAt: Date | null;
  imageId: string;
  imageDeleteHash: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ISpecialty {
  id: string;
  title: string;
  selectionType: SelectionType;
  position: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ISpecialtyItem {
  id: string;
  title: string;
  price: number;
  position: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IUser {
  id: string;
  username: string;
  phone: string;
  email: string | null;
  gender: Gender;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IPeriod {
  id: string;
  startTime: string; // Date
  endTime: string; // Date
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IReservation {
  id: string;
  type: ReservationType;
  username: string;
  phone: string;
  email: string | null;
  gender: Gender;
  isCancelled: boolean;
  people: number;
  remark: string | null;
  startAt: Date | null;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ISeat {
  id: string;
  seatNo: string;
  capacity: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IOrder {
  id: string;
  status: OrderStatus;
  type: OrderType;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IOrderMeal {
  id: string;
  amount: number;
  servedAmount: number;
}

export interface IPayment {
  id: string;
  paymentNo: string;
  price: number;
  gateway: PaymentGateway;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date | null;
}

// extend types
export interface UserInfo {
  periodEndTime: string;
  periodStartTime: string;
  seatNo: string;
  startTime: string;
  reservationType: ReservationType;
  reservationId: string;
  iat: number;
  exp: number;
  role: 'USER';
}

export interface IMealWithCategoryAndSpecialtyItems extends IMeal {
  categories: ICategory;
  categoryId: ICategory['id'];
  specialtyItems: (ISpecialtyItem & { specialtyId: ISpecialty['id'] })[];
}

export interface ISpecialtyWithSpecialtyItems extends ISpecialty {
  specialtyItems: (ISpecialtyItem & { specialtyId: ISpecialty['id'] })[];
}

export interface ICartItem extends GetMenuResponseMeal {
  amount: number;
  selectedSpecialtyItems: GetMenuResponseSpecialtyItem[];
}
