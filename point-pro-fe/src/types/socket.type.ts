export enum SocketEvent {
  // Main events
  Connect = 'connect',
  Disconnect = 'disconnect',
  Error = 'error',
  // Emit events
  JoinRoom = 'join-room',
  LeaveRoom = 'leave-room',
}

export enum SocketTopic {
  MENU = 'MENU',
  ORDER = 'ORDER',
  RESERVATION = 'RESERVATION',
}

export enum SocketRoom {
  ADMIN = 'admin',
  BOOKING = 'booking',
}

export enum OrderMessage {
  CREATE_ORDER = 'CREATE_ORDER',
  UPDATE_ORDER = 'UPDATE_ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  PAY_ORDER = 'PAY_ORDER',
}

export enum MenuMessage {
  CREATE_MEAL = 'CREATE_MEAL',
  UPDATE_MEAL = 'UPDATE_MEAL',
  DELETE_MEAL = 'DELETE_MEAL',
}

export enum ReservationMessage {
  CREATE_RESERVATION = 'CREATE_RESERVATION',
  UPDATE_RESERVATION = 'UPDATE_RESERVATION',
}

export interface INotification<N extends SocketTopic, M, R> {
  notiType: N;
  message: M;
  result: R;
}

export interface IOrderResult {
  [k: PropertyKey]: unknown;
}

export interface IMenuResult {
  [k: PropertyKey]: unknown;
}

export interface IReservationResult {
  [k: PropertyKey]: unknown;
}

export type OrderNotification = INotification<SocketTopic.ORDER, OrderMessage, IOrderResult>;
export type MenuNotification = INotification<SocketTopic.MENU, MenuMessage, IMenuResult>;
export type ReservationNotification = INotification<SocketTopic.RESERVATION, ReservationMessage, IReservationResult>;
