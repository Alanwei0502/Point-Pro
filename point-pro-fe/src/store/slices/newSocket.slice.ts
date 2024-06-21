import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const sliceName = 'newSocket';

interface INewSocketState {
  isConnected: boolean;
  rooms: string[]; // reservationId or admin
}

const initialState: INewSocketState = {
  isConnected: false,
  rooms: [],
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
  },
});

export const newSocketSliceActions = {
  ...newSocketSlice.actions,
};
