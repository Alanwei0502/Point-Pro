import { http } from './http';
import { LinePayResponse, LinePayConfirmResponse, CashPaymentResponse, OrdersResult, IOrder, LinePayConfirmRedirectPayload, PatchPaymentStatusPayload } from '~/types';

export class PaymentApi {
  static path = 'payment';
  static linePay = 'line-pay';

  static patchPaymentStatus = (payload: PatchPaymentStatusPayload) => {
    return http.patch(`${PaymentApi.path}/${payload.id}`, payload);
  };

  static postCashPayment = (payload: OrdersResult[]) => {
    return http.post<string, CashPaymentResponse>(`${PaymentApi.path}/cash/request`, payload);
  };

  static postLinePayPayment = (payload: OrdersResult[]) => {
    return http.post<string, LinePayResponse>(`${PaymentApi.path}/${PaymentApi.linePay}/request`, payload);
  };

  static getLinePayConfirm = (params: LinePayConfirmRedirectPayload) => {
    return http.get<string, LinePayConfirmResponse>(`${PaymentApi.path}/${PaymentApi.linePay}/confirm`, { params });
  };

  static getLinePayCancel = (params: { orderId: IOrder['id'] }) => {
    return http.get<string, LinePayResponse>(`${PaymentApi.path}/${PaymentApi.linePay}/cancel`, { params });
  };
}
