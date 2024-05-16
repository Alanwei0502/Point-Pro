import { http } from "./http";
import {
  EcPayResponse,
  EcPayResponseBody,
  LinePayRequestBody,
  LinePayResponse,
  EcPayConfirmResponse,
  LinePayConfirmResponse,
  CashPaymentResponse
} from "~/types";

export class PaymentApi {
  public static path = "payment";

  static paymentLinePayRequest = (payload: LinePayRequestBody) => {
    return http.post<string, LinePayResponse>(`${PaymentApi.path}/line-pay/request`, payload);
  };

  static paymentLinePayConfirm = (transactionId: string, orderId: string) => {
    return http.get<string, LinePayConfirmResponse>(`${PaymentApi.path}/line-pay/confirm`, {
      params: { transactionId, orderId }
    });
  };

  static paymentLinePayCancel = (orderId: string) => {
    return http.get<string, LinePayResponse>(`${PaymentApi.path}/line-pay/cancel`, { params: { orderId } });
  };

  static paymentEcPayRequest = (payload: EcPayResponseBody) => {
    return http.post<string, EcPayResponse>(`${PaymentApi.path}/ec-pay/request`, payload);
  };

  static paymentEcPayConfirm = (transactionId: string, orderId: string) => {
    return http.get<string, EcPayConfirmResponse>(`${PaymentApi.path}/ec-pay/confirm`, {
      params: { transactionId, orderId }
    });
  };

  static paymentEcPayCancel = () => {
    return http.post<string, EcPayResponse>(`${PaymentApi.path}/ec-pay/cancel`);
  };

  static cashPaymentRequest = (orderId: string | string[]) => {
    return http.post<string, CashPaymentResponse>(`${PaymentApi.path}/cash/request`, { orderId });
  };
}
