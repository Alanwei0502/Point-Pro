import { http } from "./http";
import { GetMenuResponse } from "~/types";

export class MenuApi {
  public static path = "menu";

  static getMenu() {
    return http.get<string, GetMenuResponse>(`${MenuApi.path}`);
  }
}
