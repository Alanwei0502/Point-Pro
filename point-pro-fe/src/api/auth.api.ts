import { LoginResponse } from '~/types';
import { http } from './http';
import { LoginPayload } from '~/types';

export class AuthApi {
  static path = 'auth';

  static login(payload: LoginPayload) {
    return http.post<string, LoginResponse>(`${AuthApi.path}/login`, payload, { withCredentials: true });
  }

  static logout() {
    return http.post(`${AuthApi.path}/logout`, null, { withCredentials: true });
  }
}
