import { DeleteOrderResponse, GetOrdersResponse, PostOrderPayload, PostOrderResponse } from "~/types/api";
import { http } from "./http";
import { Order } from "~/features/orders/type";
import { PatchOrderResponse } from "~/types/api";
import { OrderStatus } from "~/types";

export class OrderApi {
  public static path = "order";

  static postOrder(payload: PostOrderPayload) {
    return http.post<string, PostOrderResponse>(`${OrderApi.path}`, payload);
  }

  static getOrders(payload: { status: OrderStatus | "" }) {
    return http.get<string, GetOrdersResponse>(`${OrderApi.path}`, {
      params: payload
    });
  }

  static deleteOrder(payload: { orderId: string }) {
    return http.delete<string, DeleteOrderResponse>(`${OrderApi.path}`, {
      params: payload
    });
  }

  static patchOrder(order: Order) {
    return http.patch<string, PatchOrderResponse>(`${OrderApi.path}`, order);
  }
}
