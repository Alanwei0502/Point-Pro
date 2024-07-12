export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum LoginType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum OrderStatus {
  WORKING = 'WORKING',
  FINISHED = 'FINISHED',
  CANCEL = 'CANCEL',
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  TAKE_OUT = 'TAKE_OUT',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  CANCEL = 'CANCEL',
}

export enum PaymentType {
  CASH = 'CASH',
  LINE_PAY = 'LINE_PAY',
}

export enum ReservationType {
  ONLINE = 'ONLINE',
  PHONE = 'PHONE',
}

export enum Role {
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

export enum SelectionType {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  INUSE = 'INUSE',
}
