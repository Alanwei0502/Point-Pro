import { SubscribeNewsletterPayload } from '~/types';
import { http } from './http';

export class NewsletterApi {
  static path = 'newsletter';

  static subscribe(payload: SubscribeNewsletterPayload) {
    return http.post(`${NewsletterApi.path}`, payload, { withCredentials: true });
  }
}
