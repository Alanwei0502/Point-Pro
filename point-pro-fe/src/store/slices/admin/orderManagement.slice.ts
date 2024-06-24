import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { OrderApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  CancelOrderPayload,
  GetOrderPayload,
  OrderStatus,
  OrderType,
  OrdersResult,
  PatchOrderMealServedAmountPayload,
  PostOrderPayload,
} from '~/types';

const sliceName = 'orderManagement';

export interface IOrderManagementSliceState {
  statusTab: OrderStatus;
  typeTab: OrderType;
  workingOrders: OrdersResult[];
  finishedOrders: OrdersResult[];
  cancelOrders: OrdersResult[];
  checkOutOrder: OrdersResult[];
  cancelOrderConfirmModal: {
    isOpen: boolean;
    data: OrdersResult | null;
  };
  socketPayload: OrdersResult | null;
}

const initialState: IOrderManagementSliceState = {
  statusTab: OrderStatus.WORKING,
  typeTab: OrderType.DINE_IN,
  workingOrders: [],
  finishedOrders: [],
  cancelOrders: [],
  checkOutOrder: [],
  cancelOrderConfirmModal: {
    isOpen: false,
    data: null,
  },
  socketPayload: null,
};

const getAllOrders = createAppAsyncThunk(`${sliceName}/getAllOrders`, async (_, thunkApi) => {
  try {
    const orders = await OrderApi.getOrders({});
    return orders.result;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const getOrders = createAppAsyncThunk(`${sliceName}/getOrders`, async (payload: GetOrderPayload, thunkApi) => {
  try {
    const orders = await OrderApi.getOrders(payload);
    return orders.result;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postOrder = createAppAsyncThunk(`${sliceName}/postTakeOutOrder`, async (payload: PostOrderPayload, thunkApi) => {
  try {
    const createOrder = await OrderApi.postOrder(payload);
    return createOrder;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const cancelOrder = createAppAsyncThunk(`${sliceName}/cancelOrder`, async (payload: OrdersResult, thunkApi) => {
  try {
    await OrderApi.cancelOrder(payload.id);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchOrderMealServedAmount = createAppAsyncThunk(`${sliceName}/patchOrderMealServedAmount`, async (payload: OrdersResult, thunkApi) => {
  try {
    await OrderApi.patchOrderMealServedAmount({
      id: payload.id,
      orderMeals: payload.orderMeals.map((om) => ({
        id: om.id,
        amount: om.amount,
        servedAmount: om.servedAmount,
      })),
    });
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const getOrdersToCheckout = createAppAsyncThunk(`${sliceName}/getOrdersToCheckout`, async (_, thunkApi) => {
  try {
    const payload = thunkApi.getState().payment.paymentModal.data;
    if (!payload) throw new Error('payload is empty');
    const response = await OrderApi.getOrdersToCheckout(payload);
    return response.result;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const orderManagementSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setTypeTab: (state, action: PayloadAction<IOrderManagementSliceState['typeTab']>) => {
      state.typeTab = action.payload;
    },
    setStatusTab: (state, action: PayloadAction<IOrderManagementSliceState['statusTab']>) => {
      state.statusTab = action.payload;
    },
    openCancelOrderConfirmModal: (state, action: PayloadAction<OrdersResult>) => {
      state.cancelOrderConfirmModal.isOpen = true;
      state.cancelOrderConfirmModal.data = action.payload;
    },
    closeCancelOrderConfirmModal: (state) => {
      state.cancelOrderConfirmModal = initialState.cancelOrderConfirmModal;
    },
    clearCheckoutOrder: (state) => {
      state.checkOutOrder = initialState.checkOutOrder;
    },
    setSocketOrderPayload: (state, action: PayloadAction<OrdersResult | null>) => {
      state.socketPayload = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.fulfilled, (state, action) => {
        const orders = action.payload ?? [];
        if (orders.length === 0) return;

        const newWorkingOrders: OrdersResult[] = [];
        const newFinishedOrders: OrdersResult[] = [];
        const newCancelOrders: OrdersResult[] = [];

        orders.forEach((order) => {
          switch (order.status) {
            case OrderStatus.WORKING:
              newWorkingOrders.push(order);
              break;
            case OrderStatus.FINISHED:
              newFinishedOrders.push(order);
              break;
            case OrderStatus.CANCEL:
              newCancelOrders.push(order);
              break;
          }
        });

        state.workingOrders = newWorkingOrders;
        state.finishedOrders = newFinishedOrders;
        state.cancelOrders = newCancelOrders;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        const orders = action.payload ?? [];

        const orderList: OrdersResult[] = [];

        orders.forEach((order) => {
          if (order.status === state.statusTab) {
            orderList.push(order);
          }
        });

        switch (state.statusTab) {
          case OrderStatus.WORKING:
            state.workingOrders = orderList;
            break;
          case OrderStatus.FINISHED:
            state.finishedOrders = orderList;
            break;
          case OrderStatus.CANCEL:
            state.cancelOrders = orderList;
            break;
        }
      })
      .addCase(getOrdersToCheckout.fulfilled, (state, action) => {
        state.checkOutOrder = action.payload?.orders ?? [];
      });
  },
});

export const orderManagementSliceActions = {
  ...orderManagementSlice.actions,
  getAllOrders,
  getOrders,
  postOrder,
  cancelOrder,
  patchOrderMealServedAmount,
  getOrdersToCheckout,
};
