import { http } from "./http";
import { SpecialtiesResponse, SpecialtyResponse, SpecialtyItemsResponse, ISpecialty } from "~/types";

export class SpecialtyApi {
  public static path = "specialty";

  static getSpecialties() {
    return http.get<string, SpecialtiesResponse>(`${SpecialtyApi.path}`);
  }

  static getSpecialtyById(id: string) {
    return http.get<string, SpecialtyResponse>(`${SpecialtyApi.path}/${id}`);
  }

  static postSpecialty(payload: ISpecialty) {
    return http.post<string, SpecialtyResponse>(`${SpecialtyApi.path}`, payload);
  }

  static patchSpecialtyById(payload: ISpecialty) {
    return http.patch<string, SpecialtyResponse>(`${SpecialtyApi.path}/${payload.id}`, payload);
  }

  static deleteSpecialty(id: string) {
    return http.delete<string, SpecialtyResponse>(`${SpecialtyApi.path}/${id}`);
  }

  static getSpecialtyItems() {
    return http.get<string, SpecialtyItemsResponse>(`${SpecialtyApi.path}/specialtyItems`);
  }
}
