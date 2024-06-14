// Libs
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Others
import { PaymentApi } from '~/api';
import {
  EcPayResponse,
  EcPayResponseBody,
  LinePayRequestBody,
  LinePayResponse,
  EcPayConfirmResponse,
  CashPaymentResponse,
  PaymentConfirmProps,
  LinePayConfirmResponse,
} from '~/types';
import { errorHandler } from '../errorHandler';

const name = 'payment';

interface IPaymentSliceState {
  isLoading: boolean;
  error: string | null;
  // TODO
  paymentItem: any | null;
  isOpenPaymentDrawer: boolean;
  linePayResponse: LinePayResponse;
  ecPayResponse: EcPayResponse;
  cashPaymentResponse: CashPaymentResponse;
  linePayConfirmResponse: LinePayConfirmResponse;
  ecPayConfirmResponse: EcPayConfirmResponse;
}

const initialState: IPaymentSliceState = {
  isLoading: false,
  error: null,
  paymentItem: null,
  isOpenPaymentDrawer: false,
  linePayResponse: {
    message: '',
    result: null,
  },
  ecPayResponse: {
    message: '',
    result: null,
  },
  cashPaymentResponse: {
    message: '',
    result: null,
  },
  linePayConfirmResponse: {
    message: '',
    result: null,
  },
  ecPayConfirmResponse: {
    message: '',
    result: null,
  },
};

export const requestCashPayment = createAsyncThunk(`${name}/cashPaymentRequest`, async (orderId: string | string[], { rejectWithValue }) => {
  try {
    const response = await PaymentApi.cashPaymentRequest(orderId);
    return response;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const requestLinePay = createAsyncThunk(`${name}/requestLinePay`, async (request: LinePayRequestBody, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentLinePayRequest(request);
    return response;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const confirmLinePay = createAsyncThunk(`${name}/confirmLinePay`, async (Ids: PaymentConfirmProps, { rejectWithValue }) => {
  try {
    const { transactionId, orderId } = Ids;
    const response = await PaymentApi.paymentLinePayConfirm(transactionId, orderId);
    return response;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const cancelLinePay = createAsyncThunk(`${name}/cancelLinePay`, async (orderId: string, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentLinePayCancel(orderId);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const requestEcPay = createAsyncThunk(`${name}/requestEcPay`, async (request: EcPayResponseBody, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentEcPayRequest(request);
    return response;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const confirmEcPay = createAsyncThunk(`${name}/confirmEcPay`, async (Ids: PaymentConfirmProps, { rejectWithValue }) => {
  try {
    const { transactionId, orderId } = Ids;
    const response = await PaymentApi.paymentEcPayConfirm(transactionId, orderId);
    return response;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const cancelEcPay = createAsyncThunk(`${name}/cancelEcPay`, async (_, { rejectWithValue }) => {
  try {
    const response = await PaymentApi.paymentEcPayCancel();
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const paymentSlice = createSlice({
  name,
  initialState,
  reducers: {
    openPaymentDrawer: (state, action: PayloadAction<IPaymentSliceState['paymentItem']>) => {
      state.paymentItem = action.payload;
      state.isOpenPaymentDrawer = true;
    },
    closePaymentDrawer: (state) => {
      state.paymentItem = initialState.paymentItem;
      state.isOpenPaymentDrawer = initialState.isOpenPaymentDrawer;
    },
    clearCashPaymentResponse: (state) => {
      state.cashPaymentResponse = initialState.cashPaymentResponse;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(requestLinePay.fulfilled, (state, { payload }) => {
      state.linePayResponse = payload;
    });
    builder.addCase(confirmLinePay.fulfilled, (state, { payload }) => {
      state.linePayConfirmResponse = payload;
    });
    builder.addCase(cancelLinePay.fulfilled, (state, { payload }) => {
      state.linePayResponse = payload;
    });
    builder.addCase(requestEcPay.fulfilled, (state, { payload }) => {
      state.ecPayResponse = payload;
    });
    builder.addCase(confirmEcPay.fulfilled, (state, { payload }) => {
      state.ecPayConfirmResponse = payload;
    });
    builder.addCase(cancelEcPay.fulfilled, (state, { payload }) => {
      state.ecPayResponse = payload;
    });
    builder.addCase(requestCashPayment.fulfilled, (state, { payload }) => {
      state.cashPaymentResponse = payload;
    });
  },
});

export const { openPaymentDrawer, closePaymentDrawer, clearCashPaymentResponse } = paymentSlice.actions;
