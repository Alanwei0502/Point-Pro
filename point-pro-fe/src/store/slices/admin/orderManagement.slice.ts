import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { OrderApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import {
  CancelOrderPayload,
  GetOrderPayload,
  OrderStatus,
  OrderType,
  OrdersResult,
  PatchOrderMealServedAmountPayload,
  PostOrderPayload,
  SocketTopic,
} from '~/types';

const name = 'orderManagement';

export interface IOrderManagementSliceState {
  statusTab: OrderStatus;
  typeTab: OrderType;
  workingOrders: OrdersResult[];
  finishedOrders: OrdersResult[];
  cancelOrders: OrdersResult[];
  cancelOrderConfirmModal: {
    isOpen: boolean;
    data: OrdersResult | null;
  };
}

const initialState: IOrderManagementSliceState = {
  statusTab: OrderStatus.WORKING,
  typeTab: OrderType.DINE_IN,

  workingOrders: [],
  finishedOrders: [],
  cancelOrders: [],

  cancelOrderConfirmModal: {
    isOpen: false,
    data: null,
  },
};

const getAllOrders = createAppAsyncThunk(`${name}/getAllOrders`, async (_, { rejectWithValue }) => {
  try {
    const orders = await OrderApi.getOrders({});
    return orders.result;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

const getOrders = createAppAsyncThunk(`${name}/getOrders`, async (payload: GetOrderPayload, { rejectWithValue }) => {
  try {
    const orders = await OrderApi.getOrders(payload);
    return orders.result;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

const postOrder = createAppAsyncThunk(`${name}/postTakeOutOrder`, async (payload: PostOrderPayload, { getState, rejectWithValue }) => {
  try {
    const socket = getState().socket.socket;
    const createOrder = await OrderApi.postOrder(payload);
    socket && socket.emit(SocketTopic.ORDER, createOrder);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

const cancelOrder = createAppAsyncThunk(`${name}/cancelOrder`, async (payload: CancelOrderPayload, { getState, rejectWithValue }) => {
  try {
    const socket = getState().socket.socket;
    const cancelOrder = await OrderApi.cancelOrder(payload);
    socket && socket.emit(SocketTopic.ORDER, cancelOrder);
  } catch (error) {
    // errorHandler(error);
    return rejectWithValue(error);
  }
});

const patchOrderMealServedAmount = createAppAsyncThunk(
  `${name}/patchOrderMealServedAmount`,
  async (payload: PatchOrderMealServedAmountPayload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const patchOrder = await OrderApi.patchOrderMealServedAmount(payload);
      socket && socket.emit(SocketTopic.ORDER, patchOrder);
    } catch (error) {
      // errorHandler(error);
      return rejectWithValue(error);
    }
  },
);

export const orderManagementSlice = createSlice({
  name,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrders.fulfilled, (state, action) => {
        const orders = action?.payload ?? [];
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
        const orders = action?.payload ?? [];
        if (orders.length === 0) return;

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
};
