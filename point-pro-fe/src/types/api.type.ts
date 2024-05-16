import {
  DatePeriodInfo,
  ICategory,
  IMeal,
  IMenu,
  IOrder,
  IOrderMeal,
  IPaymentLog,
  ISpecialty,
  ISpecialtyItem,
  Member,
  OrderStatus,
  OrderType,
  ReservationInfo,
  SeatDetails,
  SeatInfo,
  UserInfo
} from "~/types";

export interface ApiResponse<Result> {
  message: string;
  result: Result | null;
}

// Login
export interface LoginPayload {
  account: string;
  password: string;
}
export type LoginResponse = ApiResponse<{
  authToken: string;
  member: Member;
}>;

// Generate Token
export interface GenerateTokenPayload {
  reservationId: string;
}
export type GenerateTokenResponse = ApiResponse<{
  token: string;
}>;

// Get User Info
export type GetUserInfoResponse = ApiResponse<UserInfo>;

// Meal
export interface MealDetails {
  id: string;
  title: string;
  type: string;
  price?: number;
  items?: MealDetails[];
}
export type MealResponse = ApiResponse<IMeal>;
export type MealsResponse = ApiResponse<IMeal[]>;

export interface PatchMealByIdPayload {
  mealId: string;
  payload: Partial<IMeal>; // TODO
}

// Category
export interface PostCategoryPayload {
  title: ICategory["title"];
}
export type CategoryResponse = ApiResponse<ICategory>;
export type CategoriesResponse = ApiResponse<ICategory[]>;

// Specialty
export interface PatchSpecialtyPayload {
  specialtyId: string;
  payload: ISpecialty;
}
export type SpecialtiesResponse = ApiResponse<ISpecialty[]>;
export type SpecialtyResponse = ApiResponse<ISpecialty>;
export type SpecialtyItemsResponse = ApiResponse<ISpecialtyItem[]>;

// Menu
export type GetMenuResponse = ApiResponse<IMenu[]>;

// Order
export interface OrderMealWithMeal {
  id: string;
  orderId: string;
  mealId: string;
  title: string;
  price: number;
  mealDetails: string;
  amount: number;
  servedAmount: number;
  meal: IMeal;
  order: IOrder;
}

export interface OrderWithMeal {
  id: string;
  status: OrderStatus;
  type: OrderType;
  paymentLogs: any[];
  createdAt?: number | undefined;
  updatedAt?: number | undefined;
  seats?: string[] | undefined;
  orderMeals: OrderMealWithMeal[];
}
export interface PostOrderPayload {
  orderMeals: {
    amount: number;
    id: string;
    price: number;
    specialties: ISpecialty[];
  }[];
}
export interface PatchOrderPayload {
  orderMeals: {
    amount: number;
    id: string;
    price: number;
    specialties: ISpecialty[];
  }[];
}
export type PostOrderResponse = ApiResponse<IOrder>;
export type DeleteOrderResponse = ApiResponse<IOrder>;
export type PatchOrderResponse = ApiResponse<IOrder>;
export type GetOrdersResponse = ApiResponse<IOrder[]>;

// Image
export interface updateImgPayload {}
export type updateImgResponse = ApiResponse<string>;

export type PaymentLogsResponse = {
  orderId: string;
  price: number;
  status: string;
  gateway: string;
  createdAt: string;
  paymentNo: string;
  updateAt: string;
  order: {
    id: string;
    orderId: string;
    mealId: string;
    title: string;
    price: number;
    mealDetails: string;
    amount: string;
    servedAmount: string;
    meal: IMeal;
    orderMeals: IOrderMeal[];
  };
  parentOrder: {
    id: string;
    parentOrderId: string;
    reservationId: string;
    type: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
};

export interface PaymentConfirmProps {
  transactionId: string;
  orderId: string;
}

// Line Pay
export interface LinePayRequestBody {
  orderId: string | string[];
  confirmUrl: string;
  cancelUrl: string;
}

export type LinePayResponse = ApiResponse<{
  returnCode: string;
  returnMessage: string;
  info: {
    paymentUrl: {
      web: string;
      app: string;
    };
    transactionId: string;
    paymentAccessToken: string;
  };
}>;

interface Product {
  id?: string;
  name: string;
  imageUrl?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

interface PayInfo {
  method: string;
  amount: number;
  creditCardNickname?: string;
  creditCardBrand?: string;
  maskedCreditCardNumber?: string;
}

interface Package {
  id: string;
  name?: string;
  amount: number;
  userFeeAmount?: number;
  products: Product[];
}

interface Shipping {
  methodId: string;
  feeAmount: number;
  address: string;
}

export interface Info {
  orderId: string;
  transactionId: string;
  authorizationExpireDate?: string;
  regKey?: string;
  payInfo: PayInfo[];
  packages: Package[];
  shipping?: Shipping;
}

export type LinePayConfirmResponse = ApiResponse<{
  paymentLogs: PaymentLogsResponse[];
  response: {
    body: {
      info: Info;
      returnCode: string;
      returnMessage: string;
    };
  };
}>;

// Ec Pay
export interface EcPayResponseBody {
  orderId: string | string[];
  confirmUrl: string;
}

export type EcPayResponse = ApiResponse<{
  RtnCode: string;
  RtnMsg: string;
  TradeNo: string;
  TradeAmt: string;
  PaymentDate: string;
  PaymentType: string;
  PaymentTypeChargeFee: string;
  TradeDate: string;
  SimulatePaid: string;
}>;

export type EcPayConfirmResponse = ApiResponse<{
  paymentLogs: PaymentLogsResponse[];
}>;

// Cash Pay
export type CashPaymentResponse = ApiResponse<{
  order: IOrder[];
  paymentLogs: PaymentLogsResponse[];
}>;

// Reservation
export interface PostReservationPayload {
  type: string;
  options: { [key: string]: any };
  amount: number;
  periodStartedAt: Date;
}

export interface PatchReservation {
  startOfMeal?: Date | null;
  endOfMeal?: Date | null;
  options?: { [key: string]: any };
}

export interface PatchReservationPayload {
  reservationId: string;
  payload: PatchReservation;
}

export type ReservationsResponse = ApiResponse<ReservationInfo[]>;
export type ReservationResponse = ApiResponse<ReservationInfo>;

// Seat
export interface SeatsPayload {
  date?: string;
  periodId?: string;
}

export interface SeatByIdPayload {
  seatId: string;
  date: string;
}

export type SeatsResponse = ApiResponse<SeatInfo[]>;
export type SeatsDetailResponse = ApiResponse<SeatDetails>;
export type PeriodsResponse = ApiResponse<DatePeriodInfo>;

// Mailer
export interface MailerRequestBody {
  from?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html: string;
}
