import { createSlice } from '@reduxjs/toolkit';
import { appDayjs, dateForm } from '~/utils';

const name = 'adminUI';

export interface IadminUISliceState {
  clock: string;
  loginLoading: {
    isOpen: boolean;
    progress: number;
  };
}

const initialState: IadminUISliceState = {
  clock: appDayjs().format(dateForm.fullDateWithSecond),
  loginLoading: {
    isOpen: false,
    progress: 0,
  },
};

export const adminUISlice = createSlice({
  name,
  initialState,
  reducers: {
    setClock(state) {
      state.clock = appDayjs().format(dateForm.fullDateWithSecond);
    },
    openAdminLoginLoading(state) {
      state.loginLoading.isOpen = true;
    },
    closeAdminLoginLoading(state) {
      state.loginLoading = initialState.loginLoading;
    },
  },
});

export const adminUISliceActions = {
  ...adminUISlice.actions,
};
