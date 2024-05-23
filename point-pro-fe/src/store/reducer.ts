import { combineReducers } from '@reduxjs/toolkit';
import {
  authSlice,
  categorySlice,
  loadingSlice,
  orderSlice,
  paymentSlice,
  socketSlice,
  specialtySlice,
  bookingSlice,
  takeOrderSlice,
  periodSlice,
} from './slices';
import { counterSlice } from '~/features/home/slice';

const reducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [categorySlice.name]: categorySlice.reducer,
  [specialtySlice.name]: specialtySlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [loadingSlice.name]: loadingSlice.reducer,
  [periodSlice.name]: periodSlice.reducer,
});

export default reducer;
