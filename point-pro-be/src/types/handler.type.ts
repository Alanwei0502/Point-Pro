import { Request } from 'express';
import { ReservationAuth, UserAuth } from './shared';

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
