// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others

const name = "loading";

interface ILoadingSliceState {
  isLoading: boolean;
}

const initialState: ILoadingSliceState = {
  isLoading: false
};

export const loadingSlice = createSlice({
  name,
  initialState,
  reducers: {
    openLoading: (state) => {
      state.isLoading = true;
    },
    closeLoading: (state) => {
      state.isLoading = false;
    }
  }
});

export const { openLoading, closeLoading } = loadingSlice.actions;
