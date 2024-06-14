import { http } from './http';
import {
  PatchReservationResponse,
  PostReservationPayload,
  PatchReservationPayload,
  PostReservationResponse,
  GetReservationResponse,
  DeleteReservationResponse,
  IReservation,
} from '~/types';

export class ReservationApi {
  public static path = 'reservation';

  static getReservations(date: Date) {
    return http.get<string, GetReservationResponse>(`${ReservationApi.path}`, { params: { date } });
  }

  static postReservation(payload: PostReservationPayload) {
    return http.post<string, PostReservationResponse>(`${ReservationApi.path}`, payload, { withCredentials: true });
  }

  static patchReservation({ id, ...payload }: PatchReservationPayload) {
    return http.patch<string, PatchReservationResponse>(`${ReservationApi.path}/${id}`, payload, { withCredentials: true });
  }

  static startDiningReservation({ id }: { id: IReservation['id'] }) {
    return http.patch<string, PatchReservationResponse>(`${ReservationApi.path}/${id}/start`);
  }

  static deleteReservation(id: IReservation['id']) {
    return http.delete<string, DeleteReservationResponse>(`${ReservationApi.path}/${id}`);
  }
}
