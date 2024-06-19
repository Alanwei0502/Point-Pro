import { http } from './http';
import { GetSeatResponse } from '~/types';

export class SeatApi {
  static path = 'seat';

  static getSeats() {
    return http.get<string, GetSeatResponse>(SeatApi.path);
  }
}
