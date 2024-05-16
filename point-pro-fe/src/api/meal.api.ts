import { http } from "./http";
import { MealsResponse, MealResponse, PatchMealByIdPayload, IMeal } from "~/types";

export class MealApi {
  public static path = "meal";

  static getMeals() {
    return http.get<string, MealsResponse>(MealApi.path, { params: { maxResult: 999 } });
  }

  static getMealById(mealId: string) {
    return http.get<string, MealResponse>(`${MealApi.path}/${mealId}`);
  }

  static postMeal(payload: IMeal) {
    return http.post<string, MealResponse>(MealApi.path, payload);
  }

  static patchMealById({ mealId, payload }: PatchMealByIdPayload) {
    return http.patch<string, MealResponse>(`${MealApi.path}/${mealId}`, payload);
  }

  static deleteMeal(mealId: string) {
    return http.delete<string, MealResponse>(`${MealApi.path}/${mealId}`);
  }
}
