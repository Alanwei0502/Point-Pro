import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { appDayjs, dateForm } from '~/utils';

const name = 'adminUI';

export interface IadminUISliceState {
  clock: string;
  loginLoading: {
    isOpen: boolean;
    progress: number;
  };
  startDiningQRCodeModal: {
    isOpen: boolean;
    data: string | null; // 前台點餐連結（queryString含token,people,startAt）
  };
}

const initialState: IadminUISliceState = {
  clock: appDayjs().format(dateForm.fullDateWithSecond),
  loginLoading: {
    isOpen: false,
    progress: 0,
  },
  startDiningQRCodeModal: {
    isOpen: false,
    data: null,
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
    openStartDiningQRCodeModal(state, action: PayloadAction<IadminUISliceState['startDiningQRCodeModal']['data']>) {
      state.startDiningQRCodeModal.isOpen = true;
      state.startDiningQRCodeModal.data = action.payload;
    },
    closeStartDiningQRCodeModal(state) {
      state.startDiningQRCodeModal = initialState.startDiningQRCodeModal;
    },
  },
});

export const adminUISliceActions = {
  ...adminUISlice.actions,
};
