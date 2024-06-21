import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const sliceName = 'dineInToken';

interface IDineInTokenState {
  token: string;
  reservationId: string;
  people: number;
  startAt: string;
}

const initialState: IDineInTokenState = {
  token: '',
  reservationId: '',
  people: 0,
  startAt: '',
};

export const dineInTokenSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setDineInToken(state, action: PayloadAction<IDineInTokenState>) {
      state.token = action.payload.token;
      state.reservationId = action.payload.reservationId;
      state.people = action.payload.people;
      state.startAt = action.payload.startAt;
    },
    removeDineInToken(state) {
      state.token = initialState.token;
      state.reservationId = initialState.reservationId;
      state.people = initialState.people;
      state.startAt = initialState.startAt;
    },
  },
  extraReducers: (builder) => {},
});

export const dineInTokenSliceActions = {
  ...dineInTokenSlice.actions,
};
