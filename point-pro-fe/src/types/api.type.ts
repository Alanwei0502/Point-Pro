import {
  ICategory,
  IMeal,
  IOrder,
  IOrderMeal,
  IPayment,
  IPeriod,
  IReservation,
  ISeat,
  ISpecialty,
  ISpecialtyItem,
  IUser,
  OrderStatus,
  OrderType,
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
export type MealWithCategoryAndSpecialtyItems = IMeal & {
  categories: ICategory;
  categoryId: ICategory['id'];
  specialtyItems: (ISpecialtyItem & { specialtyId: ISpecialty['id'] })[];
};
export type GetMealsWithCategoryAndSpecialtyItemsResponse = ApiResponse<MealWithCategoryAndSpecialtyItems[]>;
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
export type PatchMealSortingPayload = Pick<IMeal, 'id' | 'position'>[];
export type DeleteMealPaylaod = IMeal['id'];

// SPECIALTY
export type SpecialtyWithSpecialtyItems = ISpecialty & {
  specialtyItems: (ISpecialtyItem & { specialtyId: ISpecialty['id'] })[];
};
export type PostSpecialtyPayload = Pick<ISpecialty, 'title' | 'selectionType' | 'position'>;
export type PatchSpecialtyPayload = Pick<ISpecialty, 'id' | 'title' | 'selectionType'>;
export type PatchSpecialtyOrderPayload = Pick<ISpecialty, 'id' | 'position'>[];
export type DeleteSpecialtyPayload = ISpecialty['id'];
export type GetSpecialtyWithSpecialtyItemsResponse = ApiResponse<SpecialtyWithSpecialtyItems[]>;
export type SpecialtyResponse = ApiResponse<ISpecialty>;

// SPECIALTY ITEM
export type PostSpecialtyItemPayload = Pick<ISpecialtyItem, 'title' | 'price' | 'position'> & { specialtyId: ISpecialty['id'] };
export type PatchSpecialtyItemPayload = Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
export type PatchSpecialtyItemOrderPayload = Pick<ISpecialtyItem, 'id' | 'position'>[];
export type DeleteSpecialtyItemPayload = ISpecialtyItem['id'];

// MENU
export type MenuCategory = Pick<ICategory, 'id' | 'title'>;
export type MenuMeal = Pick<IMeal, 'id' | 'title' | 'imageId' | 'description' | 'isPopular' | 'price'> & {
  categoryId: ICategory['id'];
  mealSpecialtyItems: { specialtyItemId: ISpecialtyItem['id'] }[];
};
export type MenuSpecialtyItem = Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
export type MenuSpecialtiesWithItems = Pick<ISpecialty, 'id' | 'title' | 'selectionType'> & {
  specialtyItems: MenuSpecialtyItem[];
};
export type GetMenuResponse = ApiResponse<{
  categories: MenuCategory[];
  meals: MenuMeal[];
  specialtiesWithItems: MenuSpecialtiesWithItems[];
}>;

// ORDER
export type GetOrderPayload = Partial<Pick<IOrder, 'type' | 'status'>>;
export type PostOrderPayload = Pick<IOrder, 'type' | 'totalPrice'> & {
  orderMeals: {
    id: IMeal['id'];
    amount: IOrderMeal['amount'];
    specialtyItems: ISpecialtyItem['id'][];
  }[];
};
export type PatchOrderMealServedAmountPayload = {
  id: IOrder['id'];
  orderMeals: IOrderMeal[];
};

export type CancelOrderPayload = IOrder['id'];

export type OrderMealInOrdersResult = IOrderMeal & {
  meals: Pick<IMeal, 'id' | 'title' | 'imageId' | 'price' | 'isPopular'>;
  orderMealSpecialtyItems: {
    specialtyItems: Pick<ISpecialtyItem, 'id' | 'title' | 'price'>;
  }[];
};

export type OrdersResult = IOrder & {
  reservationId: IReservation['id'];
  paymentId: IPayment['id'];
  orderMeals: OrderMealInOrdersResult[];
  payments?: IPayment;
};

export type PostOrderResponse = ApiResponse<IOrder>;
export type DeleteOrderResponse = ApiResponse<IOrder>;
export type PatchOrderResponse = ApiResponse<IOrder>;
export type GetOrdersResponse = ApiResponse<OrdersResult[]>;
export type GetOrdersToCheckoutResponse = ApiResponse<{
  msg: string;
  orders: OrdersResult[];
}>;

// RESERVATION
export type ReservationInfo = IReservation & { periods: IPeriod };
export type PostReservationPayload = Pick<IReservation, 'username' | 'gender' | 'phone' | 'email' | 'people' | 'type' | 'remark'> & {
  periodId: IPeriod['id'];
};
export type PatchReservationPayload = Pick<IReservation, 'id'> & PostReservationPayload;
export type StartDiningReservationPayload = IReservation['id'];
export type DeleteReservationPayload = IReservation['id'];
export type GetReservationResponse = ApiResponse<ReservationInfo[]>;
export type PostReservationResponse = ApiResponse<IReservation['id']>;
export type PatchReservationResponse = ApiResponse<IReservation['id']>;
export type StartDiningReservationResponse = ApiResponse<string>;
export type DeleteReservationResponse = ApiResponse<IReservation['id']>;

// PERIOD
export interface AvailablePeriod extends Pick<IPeriod, 'id' | 'startTime'> {
  capacity: number;
}
export type GetPeriodsResponse = ApiResponse<AvailablePeriod[]>;

// PAYMENT
export type PaymentLogsResponse = Omit<IPayment, 'id'> & {
  orderId: IOrder['id'];
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
};

export type PatchPaymentStatusPayload = Pick<IPayment, 'id' | 'status'>;

export interface LinePayConfirmRedirectPayload {
  paymentId: IPayment['id'];
  transactionId: string;
}

export interface GetOrderToCheckOutPayload {
  type: OrderType;
  reservationId?: IReservation['id'];
  id?: IOrder['id'];
}

export type PostLinePayResponse = ApiResponse<{
  paymentId: IPayment['id'];
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
