import { createSlice } from '@reduxjs/toolkit';
import { OrderApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { clearCart, openDialog } from '~/store/slices/customer/menu.slice';
import { appDayjs, calculateCartItemPrice } from '~/utils';
import { MobileDialog, OrdersResult, OrderStatus, SocketTopic, OrderType } from '~/types';
import { openPaymentDrawer } from './payment.slice';

const name = 'order';

interface IOrderSliceState {
  status: OrderStatus;
  orders: OrdersResult[];
  currentOrder: any | null;
  mobileOrderStatusTab: number;
  cancelOrderId: string;
  isLoading: boolean;
}

const initialState: IOrderSliceState = {
  status: OrderStatus.WORKING,
  orders: [],
  currentOrder: null,
  mobileOrderStatusTab: 0,
  cancelOrderId: '',
  isLoading: false,
};

export const getOrders = createAppAsyncThunk(`${name}/getOrders`, async (payload: { status: OrderStatus } | undefined, { rejectWithValue }) => {
  try {
    const orderRes = await OrderApi.getOrders(payload ?? {});
    const { result = [] } = orderRes;
    const orders = result?.sort((a: OrdersResult, b: OrdersResult) => appDayjs(b.createdAt).valueOf() - appDayjs(a.createdAt).valueOf());

    return { orders };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const postOrder = createAppAsyncThunk(`${name}/postOrder`, async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const cart = getState().menu.cart;

    const payload = {
      type: OrderType.DINE_IN,
      totalPrice: cart.reduce((acc, cartItem) => acc + calculateCartItemPrice(cartItem), 0),
      orderMeals: cart.map((cartItem) => ({
        id: cartItem.id,
        amount: cartItem.amount,
        specialtyItems: cartItem.selectedSpecialtyItems.map((ssi) => ssi.id),
      })),
    };

    const response = await OrderApi.postOrder(payload);
    dispatch(getOrders());
    dispatch(setMobileOrderStatusTab(0));
    dispatch(openDialog({ type: MobileDialog.ORDER }));
    dispatch(clearCart());
    const socket = getState().socket.socket;
    socket && socket.emit(SocketTopic.ORDER, response);
  } catch (error) {
    return rejectWithValue(error);
  }
});

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
      });
  },
});

export const { setOrderStatus, setMobileOrderStatusTab, setCancelOrder } = orderSlice.actions;
