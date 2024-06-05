import { combineReducers } from '@reduxjs/toolkit';
import {
  authSlice,
  orderSlice,
  paymentSlice,
  socketSlice,
  bookingSlice,
  menuSlice,
  periodSlice,
  menuSettingSlice,
  takeOrderSlice,
  adminLoadingSlice,
} from './slices';
import { counterSlice } from '~/features/home/slice';
import { orderManagementSlice } from './slices/admin/orderManagement.slice';

const reducer = combineReducers({
  // customer
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  // admin
  [adminLoadingSlice.name]: adminLoadingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [menuSettingSlice.name]: menuSettingSlice.reducer,
  [orderManagementSlice.name]: orderManagementSlice.reducer,
  [counterSlice.name]: counterSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [periodSlice.name]: periodSlice.reducer,
});

export default reducer;
