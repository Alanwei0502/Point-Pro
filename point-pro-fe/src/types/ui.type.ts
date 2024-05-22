import { ICartItem } from './common.type';

export enum MobileDialog {
  CUSTOMIZED = 'CUSTOMIZED',
  CART = 'CART',
  ORDER = 'ORDER',
}

export enum MobileModal {
  PAYMENT = 'PAYMENT',
  COUNTER_REMINDER = 'COUNTER_REMINDER',
  REMOVE_CART_CONFIRM = 'REMOVE_CART_CONFIRM',
  CART_ITEM_IS_OFF = 'CART_ITEM_IS_OFF',
}

export enum CustomerBookingDialog {
  RECORD_QUERY = 'RECORD_QUERY',
  PRIVACY_POLICY = 'PRIVACY_POLICY',
  REMINDER = 'REMINDER',
  QRCODE = 'QRCODE',
}

export interface MobileModalPayload<T extends MobileModal | '', D = undefined> {
  type: T;
  data?: D;
}

export type MobileModalState =
  | MobileModalPayload<MobileModal.PAYMENT>
  | MobileModalPayload<MobileModal.COUNTER_REMINDER>
  | MobileModalPayload<MobileModal.REMOVE_CART_CONFIRM, { cartItem: ICartItem; idx: number }>
  | MobileModalPayload<MobileModal.CART_ITEM_IS_OFF, ICartItem>
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
