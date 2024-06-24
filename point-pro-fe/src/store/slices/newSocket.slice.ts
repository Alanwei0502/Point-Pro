import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const sliceName = 'newSocket';

interface INewSocketState {
  isConnected: boolean;
  rooms: string[];
  adminNotification: { id: number; title: string }[];
}

const initialState: INewSocketState = {
  isConnected: false,
  rooms: [],
  adminNotification: [],
};

export const newSocketSlice = createSlice({
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
    joinRoom: (state, action: PayloadAction<INewSocketState['rooms'][0]>) => {
      state.rooms = state.rooms.concat(action.payload);
    },
    leaveRoom: (state, action: PayloadAction<INewSocketState['rooms'][0]>) => {
      state.rooms = state.rooms.filter((room) => !action.payload.includes(room));
    },
    setAdminNotification: (state, action: PayloadAction<INewSocketState['adminNotification'][0]>) => {
      state.adminNotification = state.adminNotification.concat(action.payload);
    },
    removeAdminNotification: (state, action: PayloadAction<INewSocketState['adminNotification'][0]['id']>) => {
      state.adminNotification = state.adminNotification.filter((notification) => notification.id !== action.payload);
    },
    removeAllAdminNotification: (state) => {
      state.adminNotification = initialState.adminNotification;
    },
  },
});

export const newSocketSliceActions = {
  ...newSocketSlice.actions,
};
