import { createSlice } from '@reduxjs/toolkit';

const name = 'home';

interface IHomeState {
  callToActionModal: {
    isOpen: boolean;
  };
}

const initialState: IHomeState = {
  callToActionModal: {
    isOpen: false,
  },
};

export const homeSlice = createSlice({
  name,
  initialState,
  reducers: {
    openCallToActionModal: (state) => {
      state.callToActionModal.isOpen = true;
    },
    closeCallToActionModal: (state) => {
      state.callToActionModal = initialState.callToActionModal;
    },
  },
});

export const homeSliceActions = {
  ...homeSlice.actions,
};
