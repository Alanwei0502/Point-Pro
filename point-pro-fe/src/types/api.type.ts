import {
  ICategory,
  IMeal,
  IMealWithCategoryAndSpecialtyItems,
  IOrder,
  IOrderMeal,
  IPeriod,
  IReservation,
  ISeat,
  ISpecialty,
  ISpecialtyItem,
  ISpecialtyWithSpecialtyItems,
  IUser,
  OrderStatus,
  OrderType,
  SeatDetails,
} from '~/types';

export interface ApiResponse<Result> {
  message: string;
  result: Result | null;
}

// NEWSLETTER
export interface SubscribeNewsletterPayload {
  email: string;
}

// LOGIN ADMIN
export interface LoginPayload {
  username: IUser['username'];
  password: IUser['password'];
}
export type Token = string;
export type LoginResponse = ApiResponse<Token>;

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
  image: File;
  specialtyItems: ISpecialtyItem['id'][];
};
export type PatchMealPayload = Pick<IMeal, 'id' | 'title' | 'price' | 'description' | 'isPopular' | 'publishedAt' | 'imageId' | 'imageDeleteHash'> & {
  categoryId: ICategory['id'];
  image?: File;
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
export type GetMenuResponseMeal = Pick<IMeal, 'id' | 'title' | 'imageId' | 'description' | 'isPopular' | 'price'> & {
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

// ORDER
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

export type GetOrderPayload = {
  type?: OrderType;
  status?: OrderStatus;
};
export type PostOrderPayload = {
  type: IOrder['type'];
  totalPrice: number;
  orderMeals: {
    id: IMeal['id'];
    amount: IOrderMeal['amount'];
    specialtyItems: ISpecialtyItem['id'][];
  }[];
};

export type PatchOrderPayload = {
  id: string;
  amount: number;
  price: number;
  selectedSpecialtyItems: Pick<ISpecialtyItem, 'id' | 'title' | 'price'>[];
}[];

export type PatchOrderMealServedAmountPayload = {
  id: IOrder['id'];
  orderMeals: IOrderMeal[];
};

export type CancelOrderPayload = IOrder['id'];

export interface IOrderMealInOrdersResult extends IOrderMeal {
  meals: Pick<IMeal, 'id' | 'title' | 'imageId' | 'price' | 'isPopular'>;
  orderMealSpecialtyItems: {
    specialtyItems: Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
  }[];
}

export type OrdersResult = Pick<IOrder, 'id' | 'status' | 'type' | 'totalPrice' | 'createdAt' | 'updatedAt'> & {
  orderMeals: IOrderMealInOrdersResult[];
};

export type PostOrderResponse = ApiResponse<IOrder>;
export type DeleteOrderResponse = ApiResponse<IOrder>;
export type PatchOrderResponse = ApiResponse<IOrder>;
export type GetOrdersResponse = ApiResponse<OrdersResult[]>;

// RESERVATION
export type PostReservationPayload = Pick<IReservation, 'username' | 'gender' | 'phone' | 'email' | 'people' | 'type' | 'remark'> & {
  periodId: IPeriod['id'];
};

export type PatchReservationPayload = Pick<IReservation, 'id'> & PostReservationPayload;

export type ReservationInfo = IReservation & {
  periods: IPeriod;
};

export type GetReservationResponse = ApiResponse<ReservationInfo[]>;
export type PostReservationResponse = ApiResponse<IReservation['id']>;
export type PatchReservationResponse = ApiResponse<IReservation['id']>;
export type DeleteReservationResponse = ApiResponse<IReservation['id']>;

// PERIOD
export interface AvailablePeriod extends Pick<IPeriod, 'id' | 'startTime'> {
  capacity: number;
}

export type GetPeriodsResponse = ApiResponse<AvailablePeriod[]>;

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

// Seat
export interface SeatsPayload {
  date?: string;
  periodId?: string;
}

export interface SeatByIdPayload {
  seatId: string;
  date: string;
}

export type GetSeatResponse = ApiResponse<ISeat[]>;
export type SeatsDetailResponse = ApiResponse<SeatDetails>;

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
