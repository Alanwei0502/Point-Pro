// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { SeatApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks/useRedux";
import { SeatByIdPayload, SeatsPayload, SeatsResponse } from "~/types/api";

const name = "seat";

interface ISeatState {}

const initialState: ISeatState = {};

export const getSeats = createAppAsyncThunk<SeatsResponse, SeatsPayload>(
  `${name}/getSeats`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SeatApi.getSeats(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);
export const getSeatById = createAppAsyncThunk<SeatsResponse, SeatByIdPayload>(
  `${name}/getSeatById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await SeatApi.getSeatById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const seatSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = seatSlice.actions;
