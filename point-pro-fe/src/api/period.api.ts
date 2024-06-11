import { http } from './http';
import { GetPeriodsResponse } from '~/types';

export class PeriodApi {
  public static path = 'period';

  static getAvailablePeriods() {
    return http.get<string, GetPeriodsResponse>(`${PeriodApi.path}/available`);
  }

  static getPeriodByDate(params?: any) {
    return http.get<string, GetPeriodsResponse>(`${PeriodApi.path}`, { params });
  }
}
