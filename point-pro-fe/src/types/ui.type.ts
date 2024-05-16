import { NavigateFunction, Params } from "react-router-dom";

export enum DialogType {
  CUSTOMIZED = "CUSTOMIZED",
  CART = "CART",
  ORDER = "ORDER"
}

export enum MobileModal {
  PAYMENT = "PAYMENT",
  COUNTER_REMINDER = "COUNTER_REMINDER",
  REMOVE_CART_CONFIRM = "REMOVE_CART_CONFIRM",
  CART_ITEM_IS_OFF = "CART_ITEM_IS_OFF"
}

export interface RouterProps {
  location: Location;
  navigate: NavigateFunction;
  params: Params;
}
