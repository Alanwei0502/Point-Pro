import { MenuMeal, MenuSpecialtyItem } from './api.type';
import { Gender, OrderStatus, OrderType, PaymentGateway, PaymentStatus, ReservationType, Role, SelectionType } from './enum.type';

export interface IBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ICategory extends IBase {
  title: string;
  position: number;
}

export interface IMeal extends IBase {
  title: string;
  description: string;
  isPopular: boolean;
  price: number;
  position: number;
  publishedAt: Date | null;
  imageId: string;
  imageDeleteHash: string | null;
}

export interface ISpecialty extends IBase {
  title: string;
  selectionType: SelectionType;
  position: number;
}

export interface ISpecialtyItem extends IBase {
  title: string;
  price: number;
  position: number;
}

export interface IUser extends IBase {
  username: string;
  phone: string;
  email: string | null;
  gender: Gender;
  password: string;
  role: Role;
}

export interface IPeriod extends IBase {
  startTime: string; // Date
  endTime: string; // Date
}

export interface IReservation extends IBase {
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
}

export interface ISeat extends IBase {
  seatNo: string;
  capacity: number;
}

export interface IOrder extends IBase {
  status: OrderStatus;
  type: OrderType;
  totalPrice: number;
}

export interface IOrderMeal {
  id: string;
  amount: number;
  servedAmount: number;
}

export interface IPayment extends IBase {
  paymentNo: string;
  price: number;
  gateway: PaymentGateway;
  status: PaymentStatus;
}

export interface ICartItem extends MenuMeal {
  amount: number;
  selectedSpecialtyItems: MenuSpecialtyItem[];
}
