import { http } from "./http";
import {
  DeleteOrderResponse,
  GetOrdersResponse,
  PostOrderPayload,
  PostOrderResponse,
  PatchOrderResponse,
  OrderStatus,
  IOrder
} from "~/types";

export class OrderApi {
  public static path = "order";

  static postOrder(payload: PostOrderPayload) {
    return http.post<string, PostOrderResponse>(`${OrderApi.path}`, payload);
  }

  static getOrders(payload: { status: OrderStatus }) {
    return http.get<string, GetOrdersResponse>(`${OrderApi.path}`, {
      params: payload
    });
  }

  static deleteOrder(payload: { orderId: string }) {
    return http.delete<string, DeleteOrderResponse>(`${OrderApi.path}`, {
      params: payload
    });
  }

  static patchOrder(order: IOrder) {
    return http.patch<string, PatchOrderResponse>(`${OrderApi.path}`, order);
  }
}
