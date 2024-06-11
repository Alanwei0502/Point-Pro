import { http } from './http';
import { SeatByIdPayload, SeatsDetailResponse, GetSeatResponse } from '~/types';

export class SeatApi {
  static path = 'seat';

  static getSeats() {
    return http.get<string, GetSeatResponse>(SeatApi.path);
  }

  static getSeatById(payload: SeatByIdPayload) {
    return http.get<string, SeatsDetailResponse>(`${SeatApi.path}/${payload.seatId}`, {
      params: { date: payload.date },
    });
  }
}
