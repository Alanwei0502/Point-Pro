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

export enum BookingType {
  ONLINE = 'ONLINE',
  PHONE = 'PHONE',
}

export interface ICategory {
  id: string;
  title: string;
  position: number;
  createAt: Date;
  updatedAt?: Date;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  isPopular: boolean;
  price: number;
  position: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ISpecialty {
  id: string;
  title: string;
  selectionType: SelectionType;
  position: number;
  createAt: Date;
  updatedAt?: Date;
}

export interface ISpecialtyItem {
  id: string;
  title: string;
  price: number;
  position: number;
  createAt: Date;
  updatedAt?: Date;
}

export interface ICartItem extends GetMenuResponseMeal {
  amount: number;
  selectedSpecialtyItems: GetMenuResponseSpecialtyItem[];
}
