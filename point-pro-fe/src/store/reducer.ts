import { combineReducers } from '@reduxjs/toolkit';
import { authSlice, loadingSlice, orderSlice, paymentSlice, socketSlice, bookingSlice, takeOrderSlice, periodSlice, menuSlice } from './slices';
import { counterSlice } from '~/features/home/slice';

const reducer = combineReducers({
  [counterSlice.name]: counterSlice.reducer,
  [takeOrderSlice.name]: takeOrderSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
  [paymentSlice.name]: paymentSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [loadingSlice.name]: loadingSlice.reducer,
  [periodSlice.name]: periodSlice.reducer,
  [menuSlice.name]: menuSlice.reducer,
});

export default reducer;
