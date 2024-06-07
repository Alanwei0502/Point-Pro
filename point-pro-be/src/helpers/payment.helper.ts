// import { Meal, Order, OrderMeal, OrderStatus, Payment } from '@prisma/client';
// import { prismaClient } from './prismaClient.helper';
// // import { Product, RequestRequestBody } from 'line-pay-merchant';
// import { ApiResponse } from '../types';
// import { randomUUID } from 'crypto';

// export interface OrderMealWithMeal extends OrderMeal {
//   meal: Meal;
// }
// export interface OrderLogWithMeal extends Order {
//   orderMeals: (OrderMealWithMeal & { meal: Meal })[];
//   parentOrder: Order | null;
//   childOrders?: Order[];
// }

// interface UpdatePaymentLogBody {
//   payment: Payment | Payment[];
//   gateway: string;
//   status: string;
// }

// export class OrderProcessor {
//   static async getOrder(orderIds: string[]): Promise<OrderLogWithMeal[] | null> {
//     const orders = await prismaClient.order.findMany({
//       where: {
//         OR: [
//           {
//             id: {
//               in: orderIds,
//             },
//           },
//           {
//             parentOrderId: {
//               in: orderIds,
//             },
//           },
//         ],
//       },
//       include: {
//         orderMeals: {
//           include: {
//             meal: true,
//           },
//         },
//         parentOrder: true,
//         childOrders: true,
//       },
//     });
//     return orders;
//   }

//   static async getChildOrders(parentOrder: OrderLogWithMeal): Promise<OrderLogWithMeal[] | null> {
//     if (!parentOrder) {
//       throw new Error('No orders found');
//     }

//     const orders = await prismaClient.order.findMany({
//       where: {
//         parentOrderId: parentOrder.id,
//       },
//       include: {
//         orderMeals: {
//           include: {
//             meal: true,
//           },
//         },
//         parentOrder: true,
//         childOrders: {
//           include: {
//             orderMeals: {
//               include: {
//                 meal: true,
//               },
//             },
//           },
//         },
//       },
//     });
//     return orders;
//   }

//   static async parentOderHandler(orders: OrderLogWithMeal[]): Promise<OrderLogWithMeal | null> {
//     if (!orders) {
//       throw new Error('No orders found');
//     }

//     await Promise.all(
//       orders.map((order) =>
//         prismaClient.order.update({
//           where: { id: order.id },
//           data: { parentOrderId: orders[0].id },
//         }),
//       ),
//     );

//     const fullOrders = await OrderProcessor.getOrder(orders.map((order) => order.id));
//     const parentOrderIndex = fullOrders && fullOrders.findIndex((order) => order.id === orders[0].id);

//     return fullOrders && fullOrders[parentOrderIndex as number];
//   }

//   // static createLinePayOrder = (
//   //   orders: OrderLogWithMeal[],
//   //   orderId: string,
//   //   confirmUrl: string,
//   //   cancelUrl: string,
//   // ): RequestRequestBody => {
//   //   return {
//   //     amount: PaymentProcessor.calculateTotalAmount(orders),
//   //     currency: 'TWD',
//   //     orderId,
//   //     packages: orders.flatMap((order) =>
//   //       order.orderMeals.map((meal) => {
//   //         const mealDetails = JSON.parse(meal.mealDetails as string);
//   //         const mealDetailPrice = mealDetails.reduce((total: number, detail: { items: [] }) => {
//   //           const detailPrice = detail.items.reduce((total: number, item: { price: number }) => total + item.price, 0);
//   //           return total + detailPrice;
//   //         }, 0);
//   //         return {
//   //           id: meal.mealId,
//   //           amount: meal.price,
//   //           products: [
//   //             {
//   //               name: meal.mealTitle,
//   //               imageUrl: meal.meal.imageId,
//   //               quantity: meal.amount,
//   //               price: meal.meal.price + mealDetailPrice,
//   //             },
//   //           ] as Product[],
//   //         };
//   //       }),
//   //     ),
//   //     redirectUrls: {
//   //       confirmUrl, // Client端的轉導網址 (付款完成後，會導回此網址)
//   //       cancelUrl, // Client 端的轉導網址 (付款取消後，會導回此網址)
//   //     },
//   //   };
//   // };
// }

// export class PaymentProcessor {
//   static async getPaymentLog(orders: OrderLogWithMeal[]): Promise<Payment[] | null> {
//     const orderId = orders.map((order) => order.id);
//     console.log(orderId);
//     const paymentLog = await prismaClient.paymentLog.findMany({
//       where: {
//         orderId: {
//           in: orderId,
//         },
//       },
//       include: {
//         order: {
//           include: {
//             orderMeals: {
//               include: {
//                 meal: true,
//               },
//             },
//             parentOrder: true,
//           },
//         },
//       },
//     });
//     return paymentLog;
//   }

//   static async createPaymentLog(orders: OrderLogWithMeal[]): Promise<Payment[]> {
//     const paymentLog = orders.map(async (order) => {
//       return await prismaClient.paymentLog.create({
//         data: {
//           paymentNo: randomUUID(),
//           orderId: order.id,
//           price: order.orderMeals.reduce((acc, cur) => acc + cur.price, 0),
//           status: 'UNPAID',
//           gateway: 'NULL',
//         },
//       });
//     });
//     return await Promise.all(paymentLog);
//   }

//   static async updatePaymentLog({ payment, gateway, status }: UpdatePaymentLogBody): Promise<Payment[]> {
//     const orderId = Array.isArray(payment) ? payment.map((p) => p.orderId) : payment.orderId;
//     await prismaClient.paymentLog.updateMany({
//       where: {
//         orderId: {
//           in: orderId,
//         },
//       },
//       data: {
//         status,
//         gateway,
//       },
//     });

//     const paymentLog = await prismaClient.paymentLog.findMany({
//       where: {
//         orderId: {
//           in: orderId,
//         },
//       },
//     });

//     await prismaClient.order.updateMany({
//       where: {
//         id: {
//           in: orderId,
//         },
//         // [TODO]
//         orderMeals: {
//           every: {
//             servedAmount: {
//               gt: 0,
//             },
//           },
//         },
//       },
//       data: {
//         status:
//           status === 'SUCCESS' ? OrderStatus.SUCCESS : status === 'CANCEL' ? OrderStatus.CANCEL : OrderStatus.UNPAID,
//       },
//     });

//     return paymentLog;
//   }

//   static async checkPaymentStatus(parentOrderId: string): Promise<boolean> {
//     const orders = await prismaClient.order.findMany({
//       where: {
//         OR: [
//           {
//             id: {
//               in: parentOrderId,
//             },
//           },
//           {
//             parentOrderId: {
//               in: parentOrderId,
//             },
//           },
//         ],
//       },
//       include: { paymentLogs: true },
//     });

//     console.log('orders for check payment status', orders);

//     if (!orders) {
//       throw new Error(`Order with id ${parentOrderId} not found`);
//     }

//     const state = orders
//       .filter((order) => order.paymentLogs.length > 0)
//       .reduce(
//         (acc, cur) =>
//           acc +
//           cur.paymentLogs.reduce((sum, paymentLog) => sum + (paymentLog.status === OrderStatus.SUCCESS ? 1 : 0), 0),
//         0,
//       );

//     const totalPaymentLength = orders.filter((order) => order.paymentLogs.length > 0).length;

//     console.log('state:', state);
//     console.log('totalPaymentLength:', totalPaymentLength);

//     return state > 0 && totalPaymentLength > 0 && state === totalPaymentLength;
//   }

//   static calculateTotalAmount(orders: OrderLogWithMeal[]): number {
//     return orders.reduce(
//       (total, order) => total + order.orderMeals.reduce((sum: number, meal: OrderMeal) => sum + meal.price, 0),
//       0,
//     );
//   }

//   static async errorNotFindHandler(res: ApiResponse, message: string) {
//     res.status(400).json({ message, result: {} });
//   }
// }

// export default { OrderProcessor, PaymentProcessor };
