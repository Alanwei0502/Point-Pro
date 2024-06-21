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
  dineInTokenSlice,
  newSocketSlice,
} from './slices';

const reducer = combineReducers({
  // customer
  [homeSlice.name]: homeSlice.reducer,
  [dineInTokenSlice.name]: dineInTokenSlice.reducer,
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [newSocketSlice.name]: newSocketSlice.reducer,
  // admin
  [adminUISlice.name]: adminUISlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [menuManagementSlice.name]: menuManagementSlice.reducer,
  [orderManagementSlice.name]: orderManagementSlice.reducer,
  [reservationManagementSlice.name]: reservationManagementSlice.reducer,
  [seatManagementSlice.name]: seatManagementSlice.reducer,
});

export default reducer;
