import { http } from './http';
import {
  GetMenuResponse,
  GetCategoriesResponse,
  PostCategoryPayload,
  GetMealsWithCategoryAndSpecialtyItemsResponse,
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
  PatchMealSortingPayload,
  DeleteMealPaylaod,
  DeleteCategoryPayload,
  DeleteSpecialtyPayload,
  DeleteSpecialtyItemPayload,
  PostMealPayload,
  PatchMealPayload,
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

  static patchCategoryOrder(payload: PatchCategoryOrderPayload) {
    return http.patch(MenuApi.categoryPath, payload);
  }

  static deleteCategory(categoryId: DeleteCategoryPayload) {
    return http.delete(`${MenuApi.categoryPath}/${categoryId}`);
  }

  // MEAL
  static getMeals() {
    return http.get<string, GetMealsWithCategoryAndSpecialtyItemsResponse>(MenuApi.mealPath);
  }

  static postMeal(payload: PostMealPayload) {
    const formData = new FormData();

    const keys = Object.keys(payload) as (keyof PostMealPayload)[];
    keys.forEach((k) => {
      const value = payload[k];

      if (k === 'specialtyItems') {
        payload.specialtyItems.forEach((specialtyItemId) => {
          formData.append('specialtyItems', specialtyItemId);
        });
      } else if (k === 'image' && value instanceof File) {
        formData.append(k, value);
      } else {
        formData.append(k, value?.toString() ?? '');
      }
    });

    return http.post(MenuApi.mealPath, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static patchMeal(payload: PatchMealPayload) {
    const { id, ...restPayload } = payload;

    const formData = new FormData();

    const keys = Object.keys(restPayload) as (keyof Omit<PatchMealPayload, 'id'>)[];
    keys.forEach((k) => {
      const value = restPayload[k];

      if (k === 'specialtyItems') {
        restPayload.specialtyItems.forEach((specialtyItemId) => {
          formData.append('specialtyItems', specialtyItemId);
        });
      } else if (k === 'image' && value instanceof File) {
        formData.append(k, value);
      } else {
        formData.append(k, value?.toString() ?? '');
      }
    });

    return http.patch(`${MenuApi.mealPath}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static patchMealOrder(payload: PatchMealSortingPayload) {
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

  static patchSpecialtyOrder(payload: PatchSpecialtyOrderPayload) {
    return http.patch(MenuApi.specialtyPath, payload);
  }

  static deleteSpecialty(specialtyId: DeleteSpecialtyPayload) {
    return http.delete(`${MenuApi.specialtyPath}/${specialtyId}`);
  }

  // SPECIALTY ITEMS
  static postSpecialtyItem(payload: PostSpecialtyItemPayload) {
    return http.post(`${MenuApi.specialtyItemsPath}`, payload);
  }

  static patchSpecialtyItem(payload: PatchSpecialtyItemPayload) {
    const { id, title, price } = payload;
    return http.patch(`${MenuApi.specialtyItemsPath}/${id}`, { title, price });
  }

  static patchSpecialtyItemOrder(payload: PatchSpecialtyItemOrderPayload) {
    return http.patch(`${MenuApi.specialtyItemsPath}`, payload);
  }

  static deleteSpecialtyItem(specialtyItemId: DeleteSpecialtyItemPayload) {
    return http.delete(`${MenuApi.specialtyItemsPath}/${specialtyItemId}`);
  }
}
