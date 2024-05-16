import { http } from "./http";
import { PeriodsResponse } from "~/types/api";

export class PeriodApi {
  public static path = "period";

  static getPeriods() {
    return http.get<string, PeriodsResponse>(`${PeriodApi.path}/list`);
  }

  static getPeriodByDate(params?: any) {
    return http.get<string, PeriodsResponse>(`${PeriodApi.path}`, { params });
  }
}
