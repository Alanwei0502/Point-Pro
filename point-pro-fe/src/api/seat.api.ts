import { http } from "./http";
import { SeatsPayload, SeatsResponse, SeatByIdPayload, SeatsDetailResponse } from "~/types";

export class SeatApi {
  public static path = "seat";

  static getSeats(payload: SeatsPayload) {
    return http.get<string, SeatsResponse>(`${SeatApi.path}`, { params: payload });
  }

  static getSeatById(payload: SeatByIdPayload) {
    return http.get<string, SeatsDetailResponse>(`${SeatApi.path}/${payload.seatId}`, {
      params: { date: payload.date }
    });
  }
}
