import { LoginResponse } from '~/types';
import { http } from './http';
import { GenerateTokenPayload, GenerateTokenResponse, GetUserInfoResponse, LoginPayload } from '~/types';

export class AuthApi {
  static path = 'auth';

  static login(payload: LoginPayload) {
    return http.post<string, LoginResponse>(`${AuthApi.path}/login`, payload, { withCredentials: true });
  }

  static logout() {
    return http.post(`${AuthApi.path}/logout`, null, { withCredentials: true });
  }

  static generateToken(payload: GenerateTokenPayload) {
    return http.post<string, GenerateTokenResponse>(`${AuthApi.path}/token`, payload);
  }
}
