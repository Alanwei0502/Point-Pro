import { combineReducers } from '@reduxjs/toolkit';
import {
  authSlice,
  orderSlice,
  paymentSlice,
  socketSlice,
  bookingSlice,
  menuSlice,
  menuManagementSlice,
  takeOrderSlice,
  adminUISlice,
  orderManagementSlice,
  reservationManagementSlice,
  seatManagementSlice,
  homeSlice,
} from './slices';

const reducer = combineReducers({
  // customer
  [homeSlice.name]: homeSlice.reducer,
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  // admin
  [adminUISlice.name]: adminUISlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [menuManagementSlice.name]: menuManagementSlice.reducer,
  [orderManagementSlice.name]: orderManagementSlice.reducer,
  [reservationManagementSlice.name]: reservationManagementSlice.reducer,
  [seatManagementSlice.name]: seatManagementSlice.reducer,
});

export default reducer;
