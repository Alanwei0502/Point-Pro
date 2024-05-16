// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { PeriodApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks";
import { PeriodsResponse } from "~/types";
import { appDayjs } from "~/utils";

const name = "period";

interface IPeriodState {}

const initialState: IPeriodState = {};

export const getPeriods = createAppAsyncThunk(`${name}/getPeriods`, async (payload, { rejectWithValue }) => {
  try {
    return await PeriodApi.getPeriods();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getPeriodByDate = createAppAsyncThunk(
  `${name}/getPeriodByDate`,
  async (payload: { date: appDayjs.ConfigType }, { rejectWithValue }) => {
    try {
      return await PeriodApi.getPeriodByDate(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const periodSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});
