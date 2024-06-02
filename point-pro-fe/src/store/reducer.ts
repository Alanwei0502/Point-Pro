import { combineReducers } from '@reduxjs/toolkit';
import { authSlice, orderSlice, paymentSlice, socketSlice, bookingSlice, menuSlice, periodSlice, menuSettingSlice, takeOrderSlice } from './slices';
import { counterSlice } from '~/features/home/slice';

const reducer = combineReducers({
  // customer
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  // admin
  [authSlice.name]: authSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [menuSettingSlice.name]: menuSettingSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [counterSlice.name]: counterSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [periodSlice.name]: periodSlice.reducer,
});

export default reducer;
