import { combineReducers } from "@reduxjs/toolkit";
import {
  authSlice,
  categorySlice,
  loadingSlice,
  orderSlice,
  paymentSlice,
  socketSlice,
  specialtySlice,
  customerBookingSlice
} from "./slices";
import { counterSlice } from "~/features/home/slice";
import { takeOrderSlice } from "~/features/orders/slice";

const reducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [customerBookingSlice.name]: customerBookingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [specialtySlice.name]: specialtySlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [loadingSlice.name]: loadingSlice.reducer
});

export default reducer;
