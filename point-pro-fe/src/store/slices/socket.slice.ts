import { Socket } from 'socket.io-client';
import { createSlice } from '@reduxjs/toolkit';
import { MenuNotification, OrderNotification, ReservationNotification } from '~/types';

const name = 'socket';

interface SocketSliceState {
  socket: Socket | undefined;
  notifications: (OrderNotification | MenuNotification | ReservationNotification)[];
}

const initialState: SocketSliceState = {
  socket: undefined,
  notifications: JSON.parse(localStorage.getItem('notifications') ?? '[]'),
};

export const socketSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    resetSocket: () => {
      return initialState;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    removeNotification: (state, action) => {
      state.notifications.splice(action.payload, 1);
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      localStorage.setItem('notifications', JSON.stringify(state.notifications));
    },
  },
});

export const { setSocket, resetSocket, addNotification, removeNotification, clearNotifications } = socketSlice.actions;
