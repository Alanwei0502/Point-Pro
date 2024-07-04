import { combineReducers } from '@reduxjs/toolkit';
import dineInTokenSlice from './slices/customer/dineInToken.slice';
import socketSlice from './slices/socket.slice';
import menuSlice from './slices/customer/menu.slice';
import bookingSlice from './slices/customer/booking.slice';
import orderSlice from './slices/customer/order.slice';
import adminUISlice from './slices/admin/adminUI.slice';
import authSlice from './slices/admin/auth.slice';
import paymentSlice from './slices/admin/payment.slice';
import takeOrderSlice from './slices/admin/takeOrder.slice';
import menuManagementSlice from './slices/admin/menuManagement.slice';
import orderManagementSlice from './slices/admin/orderManagement.slice';
import reservationManagementSlice from './slices/admin/reservationManagement.slice';
import seatManagementSlice from './slices/admin/seatManagement.slice';

const reducer = combineReducers({
  // customer
  [dineInTokenSlice.name]: dineInTokenSlice.reducer,
  [socketSlice.name]: socketSlice.reducer,
  [menuSlice.name]: menuSlice.reducer,
  [bookingSlice.name]: bookingSlice.reducer,
  [orderSlice.name]: orderSlice.reducer,
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
