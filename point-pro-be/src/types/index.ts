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
  deleteReservationRequestSchema,
} from '../validators';
// Request

// P = path params, expects a [key: string]: string dictionary
// T = response body, expects any
// R = request body, expects any
// S ReqQuery = request query, expects any
// L Locas = request locals, expects any

// Request<P, T, R, S, L>

// examples

// // Request with any in all Generics
// Request<any, any, any ,any ,any>

// // Request expecting variables in body and request query
// Request<any, any, { userId: number } ,{ bookId: number } ,any>

// // Request expecting variables in query params
// Request<{ userName: string }, any, any ,any ,any>

// Response

// S ReqQuery = response body, expects any
// L Locas = response locals, expects [string]: any

// Response<S, L>

// examples

// // Response expects string array in response body
// Response<string[]>

// // Response expects success boolean array and number in data
// Response<{ success: boolean, data: number }>

type ReservationAuth = {
  reservationId: string;
  reservationType?: string;
  startTime: Date;
  seatNo: string;
  periodStartTime?: Date;
  periodEndTime?: Date;
  role?: string;
};

export interface AuthRequest extends Request {
  // auth: UserAuth | ReservationAuth;
  auth?: z.infer<typeof verifyAdminAndStaffSchema>;
}

export type ApiResponse<T = any> = Response<{
  message: string;
  result: T | null;
}>;

// MENU
export interface IGetAllMealsRequest extends Request {}

export interface ILoginRequest extends Request {
  body: z.infer<typeof loginSchema>;
}

export interface IRegisterRequest extends Request {
  body: z.infer<typeof registerSchema>;
}

// CATEGORY
export interface IGetCategoryByIdRequest extends Request {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
}

export interface ICreateCategoryRequest extends Request {
  body: z.infer<typeof createCategoryRequestSchema>;
}

export interface IUpdateCategoryRequest extends Request {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
  body: z.infer<typeof createCategoryRequestSchema>;
}

export interface IUpdateCategoriesOrderRequest extends Request {
  body: z.infer<typeof updateCategoryOrderRequestSchema>;
}

export interface IDeleteCategoryRequest extends Request {
  params: z.infer<typeof getCategoryByIdRequestSchema>;
}

// MEAL
export interface IUpdateMealRequest extends Request {
  params: z.infer<typeof getMealByIdRequestSchema>;
  body: z.infer<typeof updateMealRequestSchema>;
}
export interface IUpdateMealOrderRequest extends Request {
  body: z.infer<typeof updateMealOrderRequestSchema>;
}

export interface ICreateMealRequest extends Request {
  body: z.infer<typeof createMealRequestSchema>;
}

export interface IDeleteMealRequest extends Request {
  params: z.infer<typeof deleteMealRequestSchma>;
}

// SPECIALTY
export interface ICreateSpecialtyRequest extends Request {
  body: z.infer<typeof createSpecialtyRequestSchema>;
}

export interface IUpdateSpecialtyRequest extends Request {
  params: z.infer<typeof getSpecialtyByIdRequestSchema>;
  body: z.infer<typeof updateSpecialtyRequestSchema>;
}

export interface IDeleteSpecialtyRequest extends Request {
  params: z.infer<typeof deleteSpecialtyRequestSchema>;
}

export interface IUpdateSpecialtyOrderRequest extends Request {
  body: z.infer<typeof updateSpecialtyOrderRequestSchema>;
}

// SPECIALTY ITEM
export interface ICreateSpecialtyItemRequest extends Request {
  body: z.infer<typeof createSpecialtyItemRequestSchema>;
}

export interface IUpdateSpecialtyItemsOrderRequest extends Request {
  body: z.infer<typeof updateSpecialtyItemOrderRequestSchema>;
}

export interface IDeleteSpecialtyItemRequest extends Request {
  params: z.infer<typeof deleteSpecialtyItemRequestSchema>;
}

// IMGUR
export interface IUploadImageRequest extends Request {
  file?: Express.Multer.File;
  body: z.infer<typeof createMealRequestSchema>;
}

export interface IPatchImageRequest extends Request {
  file?: Express.Multer.File;
  body: z.infer<typeof updateMealRequestSchema>;
}

// ORDER
export interface IGetOrderRequest extends Request {
  query: z.infer<typeof getOrderRequestSchema>;
}
export interface IPostOrderRequest extends Request {
  body: z.infer<typeof createOrderRequestSchema>;
}

export interface ICancelOrderRequest extends Request {
  params: z.infer<typeof orderIdValidatedSchema>;
}

export interface IUpdateOrderMealServedAmountRequest extends Request {
  params: z.infer<typeof orderIdValidatedSchema>;
  body: z.infer<typeof updateOrderMealServedAmountPayloadSchema>;
}

// RESERVATION
export interface ICreateReservationRequest extends Request {
  body: z.infer<typeof createReservationRequestSchema>;
}

export interface IGetReservationsRequest extends Request {
  query: z.infer<typeof getReservationsRequestSchema>;
}

export interface IUpdateReservationRequest extends Request {
  params: z.infer<typeof updateReservationRequestSchema>;
  body: z.infer<typeof createReservationRequestSchema>;
}

export interface IStartDiningReservationRequest extends Request {
  params: z.infer<typeof updateReservationRequestSchema>;
}

export interface IDeleteReservationRequest extends Request {
  params: z.infer<typeof deleteReservationRequestSchema>;
}
