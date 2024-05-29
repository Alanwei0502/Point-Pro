import {
  ICategory,
  IMeal,
  IMealWithCategoryAndSpecialtyItems,
  IOrder,
  IOrderMeal,
  IPeriod,
  IReservation,
  ISpecialty,
  ISpecialtyItem,
  ISpecialtyWithSpecialtyItems,
  IUser,
  OrderStatus,
  OrderType,
  SeatDetails,
  SeatInfo,
  UserInfo,
} from '~/types';

export interface ApiResponse<Result> {
  message: string;
  result: Result | null;
}

// Login
export interface LoginPayload {
  username: IUser['username'];
  password: IUser['password'];
}
export type LoginResponse = ApiResponse<{
  authToken: string;
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

// CATEGORY
export type GetCategoriesResponse = ApiResponse<ICategory[]>;
export type PostCategoryPayload = Pick<ICategory, 'title' | 'position'>;
export type PatchCategoryPayload = Pick<ICategory, 'id' | 'title'>;
export type PatchCategoryOrderPayload = Pick<ICategory, 'id' | 'position'>[];
export type DeleteCategoryPayload = ICategory['id'];

// MEAL
export type GetMealsWithCategoryAndSpecialtyItemsResponse = ApiResponse<IMealWithCategoryAndSpecialtyItems[]>;
export type MealResponse = ApiResponse<IMeal>;
export type PostMealPayload = Pick<IMeal, 'title' | 'price' | 'position' | 'isPopular' | 'description' | 'publishedAt'> & {
  categoryId: ICategory['id'];
  specialtyItems: ISpecialtyItem['id'][];
};
export type PatchMealOrderPayload = Pick<IMeal, 'id' | 'position'>[];
export type DeleteMealPaylaod = IMeal['id'];

export interface MealDetails {
  id: string;
  title: string;
  type: string;
  price?: number;
  items?: MealDetails[];
}

export interface PatchMealByIdPayload {
  mealId: string;
  payload: Partial<IMeal>; // TODO
}

// SPECIALTY
export type PostSpecialtyPayload = Pick<ISpecialty, 'title' | 'selectionType' | 'position'>;
export type PatchSpecialtyPayload = Pick<ISpecialty, 'id' | 'title' | 'selectionType'>;
export type PatchSpecialtyOrderPayload = Pick<ISpecialty, 'id' | 'position'>[];
export type DeleteSpecialtyPayload = ISpecialty['id'];
export type GetSpecialtyWithSpecialtyItemsResponse = ApiResponse<ISpecialtyWithSpecialtyItems[]>;
export type SpecialtyResponse = ApiResponse<ISpecialty>;

// SPECIALTY ITEM
export type PostSpecialtyItemPayload = Pick<ISpecialtyItem, 'title' | 'price' | 'position'> & { specialtyId: ISpecialty['id'] };
export type PatchSpecialtyItemPayload = Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
export type PatchSpecialtyItemOrderPayload = Pick<ISpecialtyItem, 'id' | 'position'>[];
export type DeleteSpecialtyItemPayload = ISpecialtyItem['id'];

// MENU
export type GetMenuResponseCategory = Pick<ICategory, 'id' | 'title'>;
export type GetMenuResponseMeal = Pick<IMeal, 'id' | 'title' | 'coverUrl' | 'description' | 'isPopular' | 'price'> & {
  categoryId: ICategory['id'];
  mealSpecialtyItems: Array<{ specialtyItemId: ISpecialtyItem['id'] }>;
};
export type GetMenuResponseSpecialtyItem = Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
export type GetMenuResponseSpecialtiesWithItems = Pick<ISpecialty, 'id' | 'title' | 'selectionType'> & {
  specialtyItems: Array<GetMenuResponseSpecialtyItem>;
};

export type GetMenuResponse = ApiResponse<{
  categories: GetMenuResponseCategory[];
  meals: GetMenuResponseMeal[];
  specialtiesWithItems: GetMenuResponseSpecialtiesWithItems[];
}>;

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
export type PostOrderPayload = {
  id: string;
  amount: number;
  price: number;
  selectedSpecialtyItems: Pick<ISpecialtyItem, 'id' | 'title' | 'price'>[];
}[];

export type PatchOrderPayload = {
  id: string;
  amount: number;
  price: number;
  selectedSpecialtyItems: Pick<ISpecialtyItem, 'id' | 'title' | 'price'>[];
}[];

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

export interface ILinePayConfirmPayload {
  paymentLogs: PaymentLogsResponse[];
  response: {
    body: {
      info: Info;
      returnCode: string;
      returnMessage: string;
    };
  };
}
export type LinePayConfirmResponse = ApiResponse<ILinePayConfirmPayload>;

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

export interface IEcPayConfirmPayload {
  paymentLogs: PaymentLogsResponse[];
}

export type EcPayConfirmResponse = ApiResponse<IEcPayConfirmPayload>;

// Cash Pay
export type CashPaymentResponse = ApiResponse<{
  order: IOrder[];
  paymentLogs: PaymentLogsResponse[];
}>;

// Reservation
export type PostReservationPayload = Pick<IUser, 'username' | 'gender' | 'phone' | 'email' | 'role'> & {
  periodId: IPeriod['id'];
  remark: IReservation['remark'];
  people: IReservation['people'];
  type: IReservation['type'];
};

export interface PatchReservation {
  startOfMeal?: Date | null;
  endOfMeal?: Date | null;
  options?: { [key: string]: any };
}

export interface PatchReservationPayload {
  reservationId: string;
  payload: PatchReservation;
}

export type ReservationInfo = Pick<IUser, 'username' | 'gender' | 'phone' | 'email'> &
  Pick<IReservation, 'people' | 'remark'> & { period: Pick<IPeriod, 'id' | 'startTime'> };

export type PostReservationResponse = ApiResponse<IReservation['id']>;

export type GetReservationByPhoneResponse = ApiResponse<ReservationInfo>;
export type ReservationsResponse = ApiResponse<IReservation[]>;
export type ReservationResponse = ApiResponse<IReservation>;

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
export type PeriodsResponse = ApiResponse<IPeriod[]>;

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
