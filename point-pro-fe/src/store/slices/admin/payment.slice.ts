import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaymentApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { PostLinePayResponse, LinePayConfirmRedirectPayload, OrderType, PatchPaymentStatusPayload, PaymentType } from '~/types';

const name = 'payment';

interface IPaymentSliceState {
  paymentType: PaymentType;
  paymentModal: {
    isOpen: boolean;
    data: { type: OrderType; reservationId?: string; id?: string } | null;
  };
  linePayModal: {
    isOpen: boolean;
    data: PostLinePayResponse | null;
  };
  confirmCloseLinePayModal: {
    isOpen: boolean;
  };
}

const initialState: IPaymentSliceState = {
  paymentType: PaymentType.CASH,
  paymentModal: {
    isOpen: false,
    data: null,
  },
  linePayModal: {
    isOpen: false,
    data: null,
  },
  confirmCloseLinePayModal: {
    isOpen: false,
  },
};

const requestCashPayment = createAppAsyncThunk(`${name}/cashPaymentRequest`, async (_, thunkApi) => {
  try {
    const payload = thunkApi.getState().orderManagement.checkOutOrder;
    const response = await PaymentApi.postCashPayment(payload);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const requestLinePay = createAppAsyncThunk(`${name}/requestLinePay`, async (_, thunkApi) => {
  try {
    const payload = thunkApi.getState().orderManagement.checkOutOrder;
    const response = await PaymentApi.postLinePayPayment(payload);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const confirmLinePay = createAppAsyncThunk(`${name}/confirmLinePay`, async (payload: LinePayConfirmRedirectPayload, thunkApi) => {
  try {
    const response = await PaymentApi.getLinePayConfirm(payload);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const cancelLinePay = createAppAsyncThunk(`${name}/cancelLinePay`, async (orderId: string, thunkApi) => {
  try {
    const response = await PaymentApi.getLinePayCancel({ orderId });
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchPaymentStatus = createAppAsyncThunk(`${name}/patchPaymentStatus`, async (payload: PatchPaymentStatusPayload, thunkApi) => {
  try {
    const response = await PaymentApi.patchPaymentStatus(payload);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const paymentSlice = createSlice({
  name,
  initialState,
  reducers: {
    setPaymentType(state, action: PayloadAction<IPaymentSliceState['paymentType']>) {
      state.paymentType = action.payload;
    },
    openPaymentModal(state, action: PayloadAction<IPaymentSliceState['paymentModal']['data']>) {
      state.paymentModal.isOpen = true;
      state.paymentModal.data = action.payload;
    },
    closePaymentModal(state) {
      state.paymentType = initialState.paymentType;
      state.paymentModal = initialState.paymentModal;
    },
    closeLinePayModal(state) {
      state.linePayModal = initialState.linePayModal;
    },
    openConfirmCloseLinePayModal(state) {
      state.confirmCloseLinePayModal.isOpen = true;
    },
    closeConfirmCloseLinePayModal(state) {
      state.confirmCloseLinePayModal.isOpen = initialState.confirmCloseLinePayModal.isOpen;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestLinePay.fulfilled, (state, action) => {
      state.linePayModal.isOpen = true;
      state.linePayModal.data = action.payload;
    });
  },
});

export const paymentSliceActions = {
  ...paymentSlice.actions,
  requestCashPayment,
  requestLinePay,
  confirmLinePay,
  cancelLinePay,
  patchPaymentStatus,
};
