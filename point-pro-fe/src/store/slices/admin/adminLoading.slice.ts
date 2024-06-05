import { createSlice } from '@reduxjs/toolkit';

const name = 'adminLoading';

export interface ILoadingSliceState {
  loginLoading: {
    isOpen: boolean;
    progress: number;
  };
}

const initialState: ILoadingSliceState = {
  loginLoading: {
    isOpen: false,
    progress: 0,
  },
};

export const adminLoadingSlice = createSlice({
  name,
  initialState,
  reducers: {
    openAdminLoginLoading(state) {
      state.loginLoading.isOpen = true;
    },
    closeAdminLoginLoading(state) {
      state.loginLoading = initialState.loginLoading;
    },
  },
});

export const adminLoadingSliceActions = {
  ...adminLoadingSlice.actions,
};
