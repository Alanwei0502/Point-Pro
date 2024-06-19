import { ICartItem } from './common.type';

export enum MobileDialog {
  CUSTOMIZED = 'CUSTOMIZED',
  CART = 'CART',
  ORDER = 'ORDER',
}

export enum MobileModalType {
  COUNTER_REMINDER = 'COUNTER_REMINDER',
  REMOVE_CART_CONFIRM = 'REMOVE_CART_CONFIRM',
  CART_ITEM_IS_OFF = 'CART_ITEM_IS_OFF',
}

export enum MobileBookingDialog {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REMINDER = 'REMINDER',
}

export enum ReservationModalType {
  EDIT = 'EDIT',
  CREATE = 'CREATE',
}

export interface MobileModalPayload<T extends MobileModalType | '', D = undefined> {
  type: T;
  data?: D;
}

export type MobileModalState =
  | MobileModalPayload<MobileModalType.COUNTER_REMINDER>
  | MobileModalPayload<MobileModalType.REMOVE_CART_CONFIRM, { cartItem: ICartItem; idx: number }>
  | MobileModalPayload<MobileModalType.CART_ITEM_IS_OFF, ICartItem>
  | MobileModalPayload<''>;

export interface MobileDialogPayload<T extends MobileDialog | '', D = undefined> {
  type: T;
  data?: D;
}

export type MobileDialogState =
  | MobileDialogPayload<MobileDialog.CUSTOMIZED, ICartItem>
  | MobileDialogPayload<MobileDialog.CART>
  | MobileDialogPayload<MobileDialog.ORDER>
  | MobileDialogPayload<''>;
