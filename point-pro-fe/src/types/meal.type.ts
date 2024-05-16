export enum SpecialtyType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE"
}

export interface ICategory {
  id: string;
  title: string;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  publishedAt?: string;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
  categories: string[];
  specialties: string[];
}

export interface ICombineMenu extends ICategory {
  allMeals: IMeal[];
}

export interface ISpecialty {
  id: string;
  title: string;
  type: SpecialtyType;
  items: ISpecialtyItem[];
  [key: string]: any;
}

export interface ISpecialtyItem {
  id: string;
  title: string;
  price?: number;
}

export interface ISelectedSpecialty {
  id: string;
  value: ISpecialtyItem["id"][];
}

export interface MealDetail {
  id: string;
  type: string;
  title: string;
  items: {
    id: string;
    title: string;
    price: number;
  }[];
}

export type CategoriesOnMeals = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  mealId: string;
};

export type SpecialtiesOnMeals = {
  id: string;
  position: number | null;
  createdAt: Date;
  updatedAt: Date;
  specialtyId: string;
  mealId: string;
};
