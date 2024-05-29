import { http } from './http';
import {
  GetMenuResponse,
  GetCategoriesResponse,
  PostCategoryPayload,
  GetMealsWithCategoryAndSpecialtyItemsResponse,
  MealResponse,
  PatchMealByIdPayload,
  IMeal,
  GetSpecialtyWithSpecialtyItemsResponse,
  SpecialtyResponse,
  PatchCategoryOrderPayload,
  PatchCategoryPayload,
  PatchSpecialtyPayload,
  PatchSpecialtyOrderPayload,
  PostSpecialtyPayload,
  PatchSpecialtyItemOrderPayload,
  PatchSpecialtyItemPayload,
  PostSpecialtyItemPayload,
  PatchMealOrderPayload,
  DeleteMealPaylaod,
  DeleteCategoryPayload,
  DeleteSpecialtyPayload,
  DeleteSpecialtyItemPayload,
  PostMealPayload,
} from '~/types';

export class MenuApi {
  static path = 'menu';
  static categoryPath = `${MenuApi.path}/category`;
  static mealPath = `${MenuApi.path}/meal`;
  static specialtyPath = `${MenuApi.path}/specialty`;
  static specialtyItemsPath = `${MenuApi.path}/specialty-items`;

  static getMenu() {
    return http.get<string, GetMenuResponse>(MenuApi.path);
  }

  // CATEGORY
  static getCategories() {
    return http.get<string, GetCategoriesResponse>(MenuApi.categoryPath);
  }

  static postCategory(payload: PostCategoryPayload) {
    return http.post(MenuApi.categoryPath, payload);
  }

  static patchCategory(payload: PatchCategoryPayload) {
    const { id, title } = payload;
    return http.patch(`${MenuApi.categoryPath}/${id}`, { title });
  }

  static patchCategoriesOrder(payload: PatchCategoryOrderPayload) {
    return http.patch(MenuApi.categoryPath, payload);
  }

  static deleteCategory(categoryId: DeleteCategoryPayload) {
    return http.delete(`${MenuApi.categoryPath}/${categoryId}`);
  }

  // MEAL
  static getMeals() {
    return http.get<string, GetMealsWithCategoryAndSpecialtyItemsResponse>(MenuApi.mealPath);
  }

  static getMealById(mealId: string) {
    return http.get<string, MealResponse>(`${MenuApi.mealPath}/${mealId}`);
  }

  static postMeal(payload: PostMealPayload) {
    return http.post(MenuApi.mealPath, payload);
  }

  static patchMealById({ mealId, payload }: PatchMealByIdPayload) {
    return http.patch(`${MenuApi.mealPath}/${mealId}`, payload);
  }

  static patchMealsOrder(payload: PatchMealOrderPayload) {
    return http.patch(MenuApi.mealPath, payload);
  }

  static deleteMeal(mealId: DeleteMealPaylaod) {
    return http.delete(`${MenuApi.mealPath}/${mealId}`);
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

  static patchSpecialtiesOrder(payload: PatchSpecialtyOrderPayload) {
    return http.patch(MenuApi.specialtyPath, payload);
  }

  static deleteSpecialty(id: DeleteSpecialtyPayload) {
    return http.delete(`${MenuApi.specialtyPath}/${id}`);
  }

  // SPECIALTY ITEMS
  static postSpecialtyItem(payload: PostSpecialtyItemPayload) {
    return http.post(`${MenuApi.specialtyItemsPath}`, payload);
  }

  static patchSpecialtyItem(payload: PatchSpecialtyItemPayload) {
    const { id, title, price } = payload;
    return http.patch(`${MenuApi.specialtyItemsPath}/${id}`, { title, price });
  }

  static patchSpecialtyItemsOrder(payload: PatchSpecialtyItemOrderPayload) {
    return http.patch(`${MenuApi.specialtyItemsPath}`, payload);
  }

  static deleteSpecialtyItem(id: DeleteSpecialtyItemPayload) {
    return http.delete(`${MenuApi.specialtyItemsPath}/${id}`);
  }
}
