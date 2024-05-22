import { createSlice } from '@reduxjs/toolkit';
import { OrderApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { clearCart, openDialog } from '~/store/slices/takeOrder.slice';
import { appDayjs, calculateCartItemPrice } from '~/utils';
import { MobileDialog, IOrder, OrderStatus, SocketTopic, GatherOrder } from '~/types';
import { openPaymentDrawer } from './payment.slice';

const name = 'order';

interface IOrderSliceState {
  status: OrderStatus;
  orders: IOrder[];
  currentOrder: GatherOrder | null;
  mobileOrderStatusTab: number;
  cancelOrderId: string;
  isLoading: boolean;
}

const initialState: IOrderSliceState = {
  status: OrderStatus.PENDING,
  orders: [],
  currentOrder: null,
  mobileOrderStatusTab: 0,
  cancelOrderId: '',
  isLoading: false,
};

export const getOrders = createAppAsyncThunk(
  `${name}/getOrders`,
  async (payload: { status: OrderStatus }, { rejectWithValue }) => {
    try {
      const orderRes = await OrderApi.getOrders(payload);
      const { result = [] } = orderRes;
      const orders = result?.sort(
        (a: IOrder, b: IOrder) => appDayjs(b.createdAt).valueOf() - appDayjs(a.createdAt).valueOf(),
      );

      return { orders };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const postOrder = createAppAsyncThunk(
  `${name}/postOrder`,
  async (payload: { isCustomer: boolean }, { getState, dispatch, rejectWithValue }) => {
    try {
      const cart = getState().takeOrder.cart;
      const socket = getState().socket.socket;
      const orderMeals = cart.map((cartItem) => {
        const { id, amount, selectedSpecialtyItems } = cartItem;
        return {
          id,
          amount,
          price: calculateCartItemPrice(cartItem),
          selectedSpecialtyItems,
        };
      });
      // const reservationId = '69727eec-1701-11ef-b470-6f61e1d3261a';

      const response = await OrderApi.postOrder(orderMeals);
      const { id, status, type, seats = [], paymentLogs, reservationId } = response.result!;
      const gatherOrder: GatherOrder = {
        id,
        status,
        type,
        seats,
        paymentLogs,
        orders: [response.result!],
      };

      if (payload.isCustomer) {
        dispatch(getOrders({ status: getState()[name].status }));
        dispatch(setMobileOrderStatusTab(0));
        dispatch(openDialog({ type: MobileDialog.ORDER }));
      } else {
        // 後台外帶訂單先結帳
        dispatch(openPaymentDrawer(gatherOrder));
      }
      dispatch(clearCart());
      socket && socket.emit(SocketTopic.ORDER, response);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const cancelOrder = createAppAsyncThunk(
  `${name}/cancelOrder`,
  async (arg, { getState, dispatch, rejectWithValue }) => {
    try {
      const orderId = getState()[name].cancelOrderId;
      const socket = getState().socket.socket;
      const cancelOrder = await OrderApi.deleteOrder({ orderId });
      socket && socket.emit(SocketTopic.ORDER, cancelOrder);
      dispatch(getOrders({ status: getState()[name].status }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const patchOrder = createAppAsyncThunk(
  `${name}/patchOrder`,
  async (order: IOrder, { getState, dispatch, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const updatedOrder = await OrderApi.patchOrder(order);
      socket && socket.emit(SocketTopic.ORDER, updatedOrder);
      dispatch(getOrders({ status: getState()[name].status }));
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const orderSlice = createSlice({
  name,
  initialState,
  reducers: {
    setOrderStatus: (state, action) => {
      state.status = action.payload;
    },
    setMobileOrderStatusTab: (state, action) => {
      state.mobileOrderStatusTab = action.payload;
    },
    setCancelOrder: (state, action) => {
      state.cancelOrderId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // get order
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        const { orders } = action.payload;
        state.isLoading = false;
        state.orders = orders!;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
        state.orders = initialState.orders;
      })
      // post order
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(postOrder.rejected, (state) => {
        state.isLoading = false;
      })
      // delete order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.cancelOrderId = initialState.cancelOrderId;
        state.isLoading = false;
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.cancelOrderId = initialState.cancelOrderId;
        state.isLoading = false;
      })
      // patch order
      .addCase(patchOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(patchOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(patchOrder.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setOrderStatus, setMobileOrderStatusTab, setCancelOrder } = orderSlice.actions;
