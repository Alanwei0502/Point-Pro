import { GetMenuResponseMeal, GetMenuResponseSpecialtyItem } from './api.type';

export enum SelectionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum ReservationType {
  ONLINE = 'ONLINE',
  PHONE = 'PHONE',
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export interface ICategory {
  id: string;
  title: string;
  position: number;
  createAt: Date;
  updatedAt: Date | null;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  isPopular: boolean;
  price: number;
  position: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface ISpecialty {
  id: string;
  title: string;
  selectionType: SelectionType;
  position: number;
  createAt: Date;
  updatedAt: Date | null;
}

export interface ISpecialtyItem {
  id: string;
  title: string;
  price: number;
  position: number;
  createAt: Date;
  updatedAt: Date | null;
}

export interface ICartItem extends GetMenuResponseMeal {
  amount: number;
  selectedSpecialtyItems: GetMenuResponseSpecialtyItem[];
}

export interface IUser {
  id: string;
  username: string;
  phone: string;
  email: string | null;
  gender: Gender;
  passwordHash: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date | null;
}

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

export interface IPeriod {
  id: string;
  startTime: Date;
  endTime: Date;
  available: number;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface IReservation {
  id: string;
  type: ReservationType;
  isCancelled: boolean;
  people: number;
  startAt: Date | null;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
  remark: string | null;
}
