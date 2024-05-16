import { http } from "./http";
import { CategoriesResponse, CategoryResponse, PostCategoryPayload } from "~/types";

export class CategoryApi {
  public static path = "category";

  static getCategories() {
    return http.get<string, CategoriesResponse>(CategoryApi.path);
  }

  static getCategoryById(categoryId: string) {
    return http.get<string, CategoryResponse>(`${CategoryApi.path}/${categoryId}`);
  }

  static postCategory(payload: PostCategoryPayload) {
    return http.post<string, CategoryResponse>(CategoryApi.path, payload);
  }

  static deleteCategory(categoryId: string) {
    return http.delete<string, CategoryResponse>(`${CategoryApi.path}/${categoryId}`);
  }
}
