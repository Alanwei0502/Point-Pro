import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

const sliceName = 'socket';

interface ISocketState {
  isConnected: boolean;
  rooms: string[];
  adminNotification: { id: number; title: string }[];
}

const initialState: ISocketState = {
  isConnected: false,
  rooms: [],
  adminNotification: [],
};

const socketSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    initSocket: () => {
      return;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    joinRoom: (state, action: PayloadAction<ISocketState['rooms'][0]>) => {
      state.rooms = state.rooms.concat(action.payload);
    },
    leaveRoom: (state, action: PayloadAction<ISocketState['rooms'][0]>) => {
      state.rooms = state.rooms.filter((room) => !action.payload.includes(room));
    },
    setAdminNotification: (state, action: PayloadAction<ISocketState['adminNotification'][0]>) => {
      state.adminNotification = state.adminNotification.concat(action.payload);
    },
    removeAdminNotification: (state, action: PayloadAction<ISocketState['adminNotification'][0]['id']>) => {
      state.adminNotification = state.adminNotification.filter((notification) => notification.id !== action.payload);
    },
    removeAllAdminNotification: (state) => {
      state.adminNotification = initialState.adminNotification;
    },
  },
});

export const socketSliceActions = {
  ...socketSlice.actions,
};

export default socketSlice;
