import { http } from "./http";
import {
  GenerateTokenPayload,
  GenerateTokenResponse,
  GetUserInfoResponse,
  LoginPayload,
  LoginResponse
} from "~/types/api";

export class AuthApi {
  public static path = "auth";

  static postLogin(payload: LoginPayload) {
    return http.post<string, LoginResponse>(`${AuthApi.path}/login`, payload, { withCredentials: true });
  }

  static getUserInfo() {
    return http.get<string, GetUserInfoResponse>(`${AuthApi.path}/user-info`);
  }

  static generateToken(payload: GenerateTokenPayload) {
    return http.post<string, GenerateTokenResponse>(`${AuthApi.path}/token`, payload);
  }
}
