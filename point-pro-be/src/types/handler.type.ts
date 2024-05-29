import { Request } from 'express';
import { z } from 'zod';
import { ReservationAuth, UserAuth } from './shared';
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
  deleteCategoryRequestSchema,
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

export interface AuthRequest<
  P extends { [key: string]: string } = {
    [key: string]: string;
  },
  T = any,
  R = any,
  S = { maxResult: number },
> extends Request<P, T, R, S> {
  auth: UserAuth | ReservationAuth;
}

export interface IGetAllMealsRequest<
  P extends { [key: string]: string } = {
    [key: string]: string;
  },
  T = any,
  R = any,
  S = any,
> extends AuthRequest<P, T, R, S> {}

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
  body: z.infer<typeof createCategoryRequestSchema>;
  params: z.infer<typeof getCategoryByIdRequestSchema>;
}

export interface IUpdateCategoriesOrderRequest extends Request {
  body: z.infer<typeof updateCategoryOrderRequestSchema>;
}

export interface IDeleteCategoryRequest extends Request {
  params: z.infer<typeof deleteCategoryRequestSchema>;
}

// MEAL
export interface IUpdateMealOrderRequest extends Request {
  body: z.infer<typeof updateMealOrderRequestSchema>;
}

export interface IDeleteMealRequest extends Request {
  params: z.infer<typeof deleteMealRequestSchma>;
}

// SPECIALTY
export interface ICreateSpecialtyRequest extends Request {
  body: z.infer<typeof createSpecialtyRequestSchema>;
}

export interface IUpdateSpecialtyRequest extends Request {
  body: z.infer<typeof updateSpecialtyRequestSchema>;
  params: z.infer<typeof getSpecialtyByIdRequestSchema>;
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
}
