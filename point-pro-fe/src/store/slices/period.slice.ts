// Libs
import { createSlice } from '@reduxjs/toolkit';
// Others
import { PeriodApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { IPeriod } from '~/types';
import { appDayjs } from '~/utils';

const name = 'period';

interface IPeriodSliceState {
  isLoading: boolean;
  selectedDate: appDayjs.Dayjs;
  availablePeriods: IPeriod[];
}

const initialState: IPeriodSliceState = {
  isLoading: false,
  selectedDate: appDayjs().add(2, 'day'),
  availablePeriods: [],
};

export const getAvailablePeriods = createAppAsyncThunk(
  `${name}/getAvailablePeriods`,
  async (payload, { rejectWithValue }) => {
    try {
      const result = await PeriodApi.getAvailablePeriods();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAvailablePeriods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvailablePeriods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availablePeriods = action.payload.result ?? [];
      })
      .addCase(getAvailablePeriods.rejected, (state) => {
        state.isLoading = initialState.isLoading;
        state.availablePeriods = initialState.availablePeriods;
      });
    // .addCase(getPeriodByDate.fulfilled, (state, action) => {
    //   state.availablePeriods = action.payload.result?.periods ?? [];
    // });
  },
});
