export enum SpecialtyType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE"
}

export interface ICategory {
  id: string;
  title: string;
  position?: number;
  createAt?: number;
  updatedAt?: number;
}

export interface IMeal {
  id: string;
  title: string;
  coverUrl: string;
  description: string;
  price: number;
  position: number;
  isPopular: boolean;
  createdAt?: number;
  updatedAt?: number;
  publishedAt?: string;
  categories: ICategory[];
  specialties: ISpecialty[];
}

export interface ICombineMenu extends ICategory {
  allMeals: IMeal[];
}

export interface ISpecialty {
  id: string;
  title: string;
  type: SpecialtyType;
  items: ISpecialtyItem[];
  createAt?: number;
  updatedAt?: number;
}

export interface ISpecialtyItem {
  id: string;
  title: string;
  price: number;
  createAt?: number;
  updatedAt?: number;
}

export interface IMenu extends ICategory {
  meals: IMeal[];
}
