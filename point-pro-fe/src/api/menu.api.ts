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
  PatchCategoiesOrderPayload,
  PatchCategoriesOrderResponse,
  PatchCategoryPayload,
  ICategory,
  PatchSpecialtyPayload,
  PatchSpecialtiesOrderPayload,
  PostSpecialtyPayload,
  DeleteSpecialtyResponse,
} from '~/types';

export class MenuApi {
  static path = 'menu';
  static categoryPath = `${MenuApi.path}/category`;
  static mealPath = `${MenuApi.path}/meal`;
  static specialtyPath = `${MenuApi.path}/specialty`;
  static specialtyItemsPath = `${MenuApi.specialtyPath}/specialtyItems`;

  static getMenu() {
    return http.get<string, GetMenuResponse>(MenuApi.path);
  }

  // CATEGORY
  static getCategories() {
    return http.get<string, CategoriesResponse>(MenuApi.categoryPath);
  }

  static postCategory(payload: PostCategoryPayload) {
    return http.post<string, CategoryResponse>(MenuApi.categoryPath, payload);
  }

  static patchCategory({ id, title }: PatchCategoryPayload) {
    return http.patch<string, CategoryResponse>(`${MenuApi.categoryPath}/${id}`, { title });
  }

  static deleteCategory(categoryId: ICategory['id']) {
    return http.delete<string, ''>(`${MenuApi.categoryPath}/${categoryId}`);
  }

  static patchCategoriesOrder(payload: PatchCategoiesOrderPayload) {
    return http.patch<string, PatchCategoriesOrderResponse>(MenuApi.categoryPath, payload);
  }

  // MEAL
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

  // SPECIALTY
  static getSpecialties() {
    return http.get<string, GetSpecialtyWithSpecialtyItemsResponse>(`${MenuApi.specialtyPath}`);
  }

  static postSpecialty(payload: PostSpecialtyPayload) {
    return http.post<string, SpecialtyResponse>(`${MenuApi.specialtyPath}`, payload);
  }

  static patchSpecialty(payload: PatchSpecialtyPayload) {
    const { id, title, selectionType } = payload;
    return http.patch<string, SpecialtyResponse>(`${MenuApi.specialtyPath}/${id}`, { title, selectionType });
  }

  static deleteSpecialty(id: ISpecialty['id']) {
    return http.delete<string, DeleteSpecialtyResponse>(`${MenuApi.specialtyPath}/${id}`);
  }

  static patchSpecialtiesOrder(payload: PatchSpecialtiesOrderPayload) {
    return http.patch<string, PatchSpecialtiesOrderPayload>(MenuApi.specialtyPath, payload);
  }

  // SPECIALTY ITEMS
  static patchSpecialtyItemsOrder() {
    return http.patch<string>(`${MenuApi.specialtyItemsPath}`, []);
  }
}
