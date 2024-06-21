import { createSlice } from '@reduxjs/toolkit';

const sliceName = 'home';

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
  name: sliceName,
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
