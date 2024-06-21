import { Request, Response } from 'express';
import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  createCategoryRequestSchema,
  createSpecialtyItemRequestSchema,
  createSpecialtyRequestSchema,
  deleteSpecialtyItemRequestSchema,
  deleteSpecialtyRequestSchema,
  getCategoryByIdRequestSchema,
  getSpecialtyByIdRequestSchema,
  updateCategoryOrderRequestSchema,
  updateSpecialtyOrderRequestSchema,
  updateSpecialtyItemOrderRequestSchema,
  updateSpecialtyRequestSchema,
  updateMealOrderRequestSchema,
  deleteMealRequestSchma,
  createMealRequestSchema,
  getMealByIdRequestSchema,
  updateMealRequestSchema,
  createOrderRequestSchema,
  getOrderRequestSchema,
  updateOrderMealServedAmountPayloadSchema,
  orderIdValidatedSchema,
  verifyAdminAndStaffSchema,
  createReservationRequestSchema,
  getReservationsRequestSchema,
  updateReservationRequestSchema,
  verifyCustomerSchema,
  getOrdersToCheckoutRequestSchema,
  createPaymentRequestSchema,
  confirmLinePayRequestSchema,
} from '../validators';
import { Payment, Reservation } from '@prisma/client';

// LOGIN
export enum SessionRole {
  admin = 'admin_session',
  customer = 'customer_session',
}

export interface CustomerAuth {
  role: 'customer';
  auth: z.infer<typeof verifyCustomerSchema>;
}

export interface AdminAuth {
  role: 'admin';
  auth: z.infer<typeof verifyAdminAndStaffSchema>;
}

export type AuthInfo = AdminAuth | CustomerAuth;

export interface AuthRequest extends Request {
  role?: AuthInfo['role'];
  auth?: AuthInfo['auth'];
}

export type ApiResponse<T = any> = Response<{
  message: string;
  result: T | null;
}>;

export interface ILoginRequest extends Request {
  body: z.infer<typeof loginSchema>;
}

export interface IRegisterRequest extends Request {
  body: z.infer<typeof registerSchema>;
}

// MENU
export interface IGetAllMealsRequest extends Request {}

// CATEGORY
export interface IGetCategoryByIdRequest extends AuthRequest {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
}

export interface ICreateCategoryRequest extends AuthRequest {
  body: z.infer<typeof createCategoryRequestSchema>;
}

export interface IUpdateCategoryRequest extends AuthRequest {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
  body: z.infer<typeof createCategoryRequestSchema>;
}

export interface IUpdateCategoriesOrderRequest extends AuthRequest {
  body: z.infer<typeof updateCategoryOrderRequestSchema>;
}

export interface IDeleteCategoryRequest extends AuthRequest {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
}

// MEAL
export interface IUpdateMealRequest extends AuthRequest {
  params: z.infer<typeof getMealByIdRequestSchema>;
  body: z.infer<typeof updateMealRequestSchema>;
}
export interface IUpdateMealOrderRequest extends AuthRequest {
  body: z.infer<typeof updateMealOrderRequestSchema>;
}

export interface ICreateMealRequest extends AuthRequest {
  body: z.infer<typeof createMealRequestSchema>;
}

export interface IDeleteMealRequest extends AuthRequest {
  params: z.infer<typeof deleteMealRequestSchma>;
}

// SPECIALTY
export interface ICreateSpecialtyRequest extends AuthRequest {
  body: z.infer<typeof createSpecialtyRequestSchema>;
}

export interface IUpdateSpecialtyRequest extends AuthRequest {
  params: z.infer<typeof getSpecialtyByIdRequestSchema>;
  body: z.infer<typeof updateSpecialtyRequestSchema>;
}

export interface IDeleteSpecialtyRequest extends AuthRequest {
  params: z.infer<typeof deleteSpecialtyRequestSchema>;
}

export interface IUpdateSpecialtyOrderRequest extends AuthRequest {
  body: z.infer<typeof updateSpecialtyOrderRequestSchema>;
}

// SPECIALTY ITEM
export interface ICreateSpecialtyItemRequest extends AuthRequest {
  body: z.infer<typeof createSpecialtyItemRequestSchema>;
}

export interface IUpdateSpecialtyItemsOrderRequest extends AuthRequest {
  body: z.infer<typeof updateSpecialtyItemOrderRequestSchema>;
}

export interface IDeleteSpecialtyItemRequest extends AuthRequest {
  params: z.infer<typeof deleteSpecialtyItemRequestSchema>;
}

// IMGUR
export interface IUploadImageRequest extends AuthRequest {
  file?: Express.Multer.File;
  body: z.infer<typeof createMealRequestSchema>;
}

export interface IPatchImageRequest extends AuthRequest {
  file?: Express.Multer.File;
  body: z.infer<typeof updateMealRequestSchema>;
}

// ORDER
export interface IGetOrderRequest extends AuthRequest {
  query: z.infer<typeof getOrderRequestSchema>;
}
export interface IPostOrderRequest extends AuthRequest {
  body: z.infer<typeof createOrderRequestSchema>;
}

export interface ICancelOrderRequest extends AuthRequest {
  params: z.infer<typeof orderIdValidatedSchema>;
}

export interface IUpdateOrderMealServedAmountRequest extends AuthRequest {
  params: z.infer<typeof orderIdValidatedSchema>;
  body: z.infer<typeof updateOrderMealServedAmountPayloadSchema>;
}

export interface IGetOrdersToCheckoutRequest extends AuthRequest {
  query: z.infer<typeof getOrdersToCheckoutRequestSchema>;
}

// RESERVATION
export interface ICreateReservationRequest extends AuthRequest {
  body: z.infer<typeof createReservationRequestSchema>;
}

export interface IGetReservationsRequest extends AuthRequest {
  query: z.infer<typeof getReservationsRequestSchema>;
}

export interface IUpdateReservationRequest extends AuthRequest {
  params: { reservationId: Reservation['id'] };
  body: z.infer<typeof updateReservationRequestSchema>;
}

export interface IStartDiningReservationRequest extends AuthRequest {
  params: { reservationId: Reservation['id'] };
}

export interface IDeleteReservationRequest extends AuthRequest {
  params: { reservationId: Reservation['id'] };
}

// PAYMENT
export interface ICreatePaymentRequest extends AuthRequest {
  body: z.infer<typeof createPaymentRequestSchema>;
}

export interface IConfirmLinePayRequest extends Request {
  query: z.infer<typeof confirmLinePayRequestSchema>;
}

export interface IUpdatePaymentStatusRequest extends AuthRequest {
  params: { id: Payment['id'] };
  body: { status: Payment['status'] };
}
