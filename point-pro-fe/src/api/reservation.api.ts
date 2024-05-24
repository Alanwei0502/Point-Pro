import { http } from './http';
import {
  ReservationsResponse,
  PostReservationPayload,
  PatchReservationPayload,
  GetReservationByPhoneResponse,
  PostReservationResponse,
} from '~/types';

export class ReservationApi {
  public static path = 'reservation';

  static getReservations(date: Date) {
    return http.get<string, ReservationsResponse>(`${ReservationApi.path}`, { params: { date: date ?? new Date() } });
  }

  static getReservationByPhone(phone: string) {
    return http.get<string, GetReservationByPhoneResponse>(`${ReservationApi.path}/${phone}`);
  }

  static postReservation(payload: PostReservationPayload) {
    return http.post<string, PostReservationResponse>(`${ReservationApi.path}`, payload);
  }

  static patchReservationById({ reservationId, payload }: PatchReservationPayload) {
    return http.patch<string, ReservationsResponse>(`${ReservationApi.path}/${reservationId}`, payload);
  }
}
