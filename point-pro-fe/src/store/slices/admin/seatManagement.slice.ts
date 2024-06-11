import { createSlice } from '@reduxjs/toolkit';
import { SeatApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { ISeat } from '~/types';

const name = 'seatManagement';

interface ISeatManagementSliceState {
  loading: boolean;
  count: number;
  seats: ISeat[];
}

const initialState: ISeatManagementSliceState = {
  loading: false,
  count: 0,
  seats: [],
};

const getSeats = createAppAsyncThunk(`${name}/getSeats`, async (_, thunkApi) => {
  try {
    const res = await SeatApi.getSeats();
    return res;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const seatManagementSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSeats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSeats.fulfilled, (state, action) => {
        state.loading = false;
        const seats = action.payload.result ?? [];
        state.count = seats.reduce((acc, seat) => acc + seat.capacity, 0);
        state.seats = seats;
      })
      .addCase(getSeats.rejected, (state) => {
        state.loading = false;
        state.count = initialState.count;
        state.seats = initialState.seats;
      });
  },
});

export const seatManagementSliceActions = {
  ...seatManagementSlice.actions,
  getSeats,
};
