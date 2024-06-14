import { ICartItem } from './common.type';

export enum MobileDialog {
  CUSTOMIZED = 'CUSTOMIZED',
  CART = 'CART',
  ORDER = 'ORDER',
}

export enum MobileModalType {
  PAYMENT = 'PAYMENT',
  COUNTER_REMINDER = 'COUNTER_REMINDER',
  REMOVE_CART_CONFIRM = 'REMOVE_CART_CONFIRM',
  CART_ITEM_IS_OFF = 'CART_ITEM_IS_OFF',
}

export enum MobileBookingDialog {
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REMINDER = 'REMINDER',
}

export interface MobileModalPayload<T extends MobileModalType | '', D = undefined> {
  type: T;
  data?: D;
}

export type MobileModalState =
  | MobileModalPayload<MobileModalType.PAYMENT>
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
