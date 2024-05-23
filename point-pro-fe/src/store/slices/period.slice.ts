import { createSlice } from '@reduxjs/toolkit';
import { PeriodApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { appDayjs } from '~/utils';

// TODO: delete this slice
const name = 'period';

interface IPeriodSliceState {}

const initialState: IPeriodSliceState = {};

export const getPeriodByDate = createAppAsyncThunk(
  `${name}/getPeriodByDate`,
  async (payload: { date: appDayjs.ConfigType }, { rejectWithValue }) => {
    try {
      return await PeriodApi.getPeriodByDate(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const periodSlice = createSlice({
  name,
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {},
  },
  extraReducers: {},
});
