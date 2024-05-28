import { http } from './http';
import {
  GetMenuResponse,
  CategoriesResponse,
  CategoryResponse,
  PostCategoryPayload,
  MealsResponse,
  MealResponse,
  PatchMealByIdPayload,
  IMeal,
  GetSpecialtyWithSpecialtyItemsResponse,
  SpecialtyResponse,
  SpecialtyItemsResponse,
  ISpecialty,
  PostCategoiesOrderPayload,
  PatchCategoriesOrderResponse,
  PatchCategoryPayload,
  ICategory,
  PatchSpecialtyPayload,
} from '~/types';

export class MenuApi {
  static path = 'menu';
  static categoryPath = `${MenuApi.path}/category`;
  static mealPath = `${MenuApi.path}/meal`;
  static specialtyPath = `${MenuApi.path}/specialty`;

  static getMenu() {
    return http.get<string, GetMenuResponse>(MenuApi.path);
  }

  static getCategories() {
    return http.get<string, CategoriesResponse>(MenuApi.categoryPath);
  }

  // TODO: delete
  static getCategoryById(categoryId: string) {
    return http.get<string, CategoryResponse>(`${MenuApi.categoryPath}/${categoryId}`);
  }

  static postCategory(payload: PostCategoryPayload) {
    return http.post<string, CategoryResponse>(MenuApi.categoryPath, payload);
  }

  static patchCategory(categoryId: ICategory['id'], payload: PatchCategoryPayload) {
    return http.patch<string, CategoryResponse>(`${MenuApi.categoryPath}/${categoryId}`, payload);
  }

  static deleteCategory(categoryId: string) {
    return http.delete<string, CategoryResponse>(`${MenuApi.categoryPath}/${categoryId}`);
  }

  static patchCategoriesOrder(payload: PostCategoiesOrderPayload) {
    return http.patch<string, PatchCategoriesOrderResponse>(MenuApi.categoryPath, payload);
  }
  static getMeals() {
    return http.get<string, MealsResponse>(MenuApi.mealPath);
  }

  static getMealById(mealId: string) {
    return http.get<string, MealResponse>(`${MenuApi.mealPath}/${mealId}`);
  }

  static postMeal(payload: IMeal) {
    return http.post<string, MealResponse>(MenuApi.mealPath, payload);
  }

  static patchMealById({ mealId, payload }: PatchMealByIdPayload) {
    return http.patch<string, MealResponse>(`${MenuApi.mealPath}/${mealId}`, payload);
  }

  static deleteMeal(mealId: string) {
    return http.delete<string, MealResponse>(`${MenuApi.mealPath}/${mealId}`);
  }

  static getSpecialties() {
    return http.get<string, GetSpecialtyWithSpecialtyItemsResponse>(`${MenuApi.specialtyPath}`);
  }

  static getSpecialtyById(id: string) {
    return http.get<string, SpecialtyResponse>(`${MenuApi.specialtyPath}/${id}`);
  }

  static postSpecialty(payload: ISpecialty) {
    return http.post<string, SpecialtyResponse>(`${MenuApi.specialtyPath}`, payload);
  }

  static patchSpecialty(payload: PatchSpecialtyPayload) {
    const { id, title, selectionType } = payload;
    return http.patch<string, SpecialtyResponse>(`${MenuApi.specialtyPath}/${id}`, { title, selectionType });
  }

  static deleteSpecialty(id: string) {
    return http.delete<string, SpecialtyResponse>(`${MenuApi.specialtyPath}/${id}`);
  }

  static getSpecialtyItems() {
    return http.get<string, SpecialtyItemsResponse>(`${MenuApi.specialtyPath}/specialtyItems`);
  }
}
