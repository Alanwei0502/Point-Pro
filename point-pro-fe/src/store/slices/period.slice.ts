import { createSlice } from '@reduxjs/toolkit';
import { PeriodApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { appDayjs } from '~/utils';
import { errorHandler } from '../errorHandler';

// TODO: delete this slice
const name = 'period';

interface IPeriodSliceState {}

const initialState: IPeriodSliceState = {};

export const getPeriodByDate = createAppAsyncThunk(`${name}/getPeriodByDate`, async (payload: { date: appDayjs.ConfigType }, { rejectWithValue }) => {
  try {
    return await PeriodApi.getPeriodByDate(payload);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const periodSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {},
  },
  extraReducers: {},
});
