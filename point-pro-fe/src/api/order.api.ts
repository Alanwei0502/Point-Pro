import { http } from './http';
import {
  DeleteOrderResponse,
  GetOrdersResponse,
  PostOrderPayload,
  PostOrderResponse,
  PatchOrderResponse,
  IOrder,
  GetOrderPayload,
  CancelOrderPayload,
  PatchOrderMealServedAmountPayload,
  GetOrderToCheckOutPayload,
  GetOrdersToCheckoutResponse,
} from '~/types';

export class OrderApi {
  public static path = 'order';

  static getOrders(params: GetOrderPayload) {
    return http.get<string, GetOrdersResponse>(OrderApi.path, { params });
  }

  static postOrder(payload: PostOrderPayload) {
    return http.post<string, PostOrderResponse>(OrderApi.path, payload);
  }

  static deleteOrder(payload: { orderId: string }) {
    return http.delete<string, DeleteOrderResponse>(OrderApi.path, {
      params: payload,
    });
  }

  static patchOrder(order: IOrder) {
    return http.patch<string, PatchOrderResponse>(OrderApi.path, order);
  }

  static patchOrderMealServedAmount(payload: PatchOrderMealServedAmountPayload) {
    return http.patch(`${OrderApi.path}/${payload.id}/served-amount`, payload);
  }

  static cancelOrder(orderId: CancelOrderPayload) {
    return http.patch<string, PatchOrderResponse>(`${OrderApi.path}/${orderId}/cancel`);
  }

  static getOrdersToCheckout(params: GetOrderToCheckOutPayload) {
    return http.get<string, GetOrdersToCheckoutResponse>(`${OrderApi.path}/checkout`, { params });
  }
}
