import { createSlice } from '@reduxjs/toolkit';
import { OrderApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { appDayjs, calculateCartItemPrice } from '~/utils';
import { OrdersResult, OrderStatus, OrderType } from '~/types';

const sliceName = 'order';

interface IOrderSliceState {
  orders: OrdersResult[];
  isLoading: boolean;
}

const initialState: IOrderSliceState = {
  orders: [],
  isLoading: false,
};

const getOrders = createAppAsyncThunk(`${sliceName}/getOrders`, async (payload: { status: OrderStatus } | undefined, thunkApi) => {
  try {
    const orderRes = await OrderApi.getOrders(payload ?? {});
    const { result = [] } = orderRes;
    const orders = result?.sort((a: OrdersResult, b: OrdersResult) => appDayjs(b.createdAt).valueOf() - appDayjs(a.createdAt).valueOf());
    return { orders };
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postOrder = createAppAsyncThunk(`${sliceName}/postOrder`, async (_, thunkApi) => {
  try {
    const cart = thunkApi.getState().menu.cart;

    const payload = {
      type: OrderType.DINE_IN,
      totalPrice: cart.reduce((acc, cartItem) => acc + calculateCartItemPrice(cartItem), 0),
      orderMeals: cart.map((cartItem) => ({
        id: cartItem.id,
        amount: cartItem.amount,
        specialtyItems: cartItem.selectedSpecialtyItems.map((ssi) => ssi.id),
      })),
    };

    await OrderApi.postOrder(payload);
    thunkApi.dispatch(getOrders());
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const orderSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

export const orderSliceActions = {
  ...orderSlice.actions,
  getOrders,
  postOrder,
};

export default orderSlice;
