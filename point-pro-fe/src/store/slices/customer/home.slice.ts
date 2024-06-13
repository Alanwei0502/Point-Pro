import { createSlice } from '@reduxjs/toolkit';

const name = 'home';

interface IHomeState {
  callToActionModal: {
    isOpen: boolean;
  };
  thanksForSubscribingModal: {
    isOpen: boolean;
  };
}

const initialState: IHomeState = {
  callToActionModal: {
    isOpen: false,
  },
  thanksForSubscribingModal: {
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
    openThanksForSubscribingModal: (state) => {
      state.thanksForSubscribingModal.isOpen = true;
    },
    closeThanksForSubscribingModal: (state) => {
      state.thanksForSubscribingModal = initialState.thanksForSubscribingModal;
    },
  },
});

export const homeSliceActions = {
  ...homeSlice.actions,
};
