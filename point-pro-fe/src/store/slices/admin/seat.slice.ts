import { createSlice } from '@reduxjs/toolkit';
import { SeatApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import { SeatByIdPayload, SeatsDetailResponse, SeatsPayload, SeatsResponse } from '~/types';

const name = 'seat';

interface ISeatState {}

const initialState: ISeatState = {};

export const getSeats = createAppAsyncThunk<SeatsResponse, SeatsPayload>(`${name}/getSeats`, async (payload, { rejectWithValue }) => {
  try {
    return await SeatApi.getSeats(payload);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});
export const getSeatById = createAppAsyncThunk<SeatsDetailResponse, SeatByIdPayload>(`${name}/getSeatById`, async (payload, { rejectWithValue }) => {
  try {
    return await SeatApi.getSeatById(payload);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const seatSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {},
});

export const {} = seatSlice.actions;
