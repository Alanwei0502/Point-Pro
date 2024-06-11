import { combineReducers } from '@reduxjs/toolkit';
import {
  authSlice,
  orderSlice,
  paymentSlice,
  socketSlice,
  bookingSlice,
  menuSlice,
  periodSlice,
  menuManagementSlice,
  takeOrderSlice,
  adminLoadingSlice,
  orderManagementSlice,
  reservationManagementSlice,
  seatManagementSlice,
} from './slices';
import { counterSlice } from '~/features/home/slice';

const reducer = combineReducers({
  // customer
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [counterSlice.name]: counterSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [periodSlice.name]: periodSlice.reducer,
  // admin
  [adminLoadingSlice.name]: adminLoadingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [menuManagementSlice.name]: menuManagementSlice.reducer,
  [orderManagementSlice.name]: orderManagementSlice.reducer,
  [reservationManagementSlice.name]: reservationManagementSlice.reducer,
  [seatManagementSlice.name]: seatManagementSlice.reducer,
});

export default reducer;
