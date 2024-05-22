import { http } from './http';
import { PeriodsResponse } from '~/types';

export class PeriodApi {
  public static path = 'period';

  static getAvailablePeriods() {
    return http.get<string, PeriodsResponse>(`${PeriodApi.path}/available`);
  }

  static getPeriodByDate(params?: any) {
    return http.get<string, PeriodsResponse>(`${PeriodApi.path}`, { params });
  }
}
