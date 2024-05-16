import { http } from "./http";
import {
  ReservationsResponse,
  ReservationResponse,
  PostReservationPayload,
  PatchReservationPayload
} from "~/types/api";

export class ReservationApi {
  public static path = "reservation";

  static getReservations(date: Date) {
    return http.get<string, ReservationsResponse>(`${ReservationApi.path}`, { params: { date: date ?? new Date() } });
  }

  static getReservationById(reservationId: string) {
    return http.get<string, ReservationResponse>(`${ReservationApi.path}/${reservationId}`);
  }

  static postReservation(payload: PostReservationPayload) {
    return http.post<string, ReservationsResponse>(`${ReservationApi.path}`, payload);
  }

  static patchReservationById({ reservationId, payload }: PatchReservationPayload) {
    return http.patch<string, ReservationsResponse>(`${ReservationApi.path}/${reservationId}`, payload);
  }
}
