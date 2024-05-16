import { http } from "./http";
import {
  Id,
  SpecialtiesResponse,
  SpecialtyResponse,
  PostSpecialtyPayload,
  PatchSpecialtyById,
  SpecialtyItemsResponse
} from "~/types/api";

export class SpecialtyApi {
  public static path = "specialty";

  static getSpecialties() {
    return http.get<string, SpecialtiesResponse>(`${SpecialtyApi.path}`);
  }

  static getSpecialtyById(specialtyId: Id) {
    return http.get<string, SpecialtyResponse>(`${SpecialtyApi.path}/${specialtyId}`);
  }

  static postSpecialty(payload: PostSpecialtyPayload) {
    return http.post<string, SpecialtyResponse>(`${SpecialtyApi.path}`, payload);
  }

  static patchSpecialtyById({ specialtyId, payload }: PatchSpecialtyById) {
    return http.patch<string, SpecialtyResponse>(`${SpecialtyApi.path}/${specialtyId}`, payload);
  }

  static deleteSpecialty(specialtyId: Id) {
    return http.delete<string, SpecialtyResponse>(`${SpecialtyApi.path}/${specialtyId}`);
  }

  static getSpecialtyItems() {
    return http.get<string, SpecialtyItemsResponse>(`${SpecialtyApi.path}/specialtyItems`);
  }
}
