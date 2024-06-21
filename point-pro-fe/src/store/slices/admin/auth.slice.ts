import { createSlice } from '@reduxjs/toolkit';
import { AuthApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { LoginPayload, LoginResponse } from '~/types';

const sliceName = 'auth';

interface IAuthState {
  isLoading: boolean;
  authToken: string;
}

const initialState: IAuthState = {
  isLoading: false,
  authToken: '',
};

const login = createAppAsyncThunk<LoginResponse, LoginPayload>(`${sliceName}/login`, async (payload, thunkApi) => {
  try {
    return await AuthApi.login(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const logout = createAppAsyncThunk(`${sliceName}/logout`, async (_, thunkApi) => {
  try {
    await AuthApi.logout();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setAdminToken(state) {
      const token = sessionStorage.getItem('token') ?? '';
      state.authToken = token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = initialState.isLoading;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { result } = action.payload;
        if (result) {
          state.authToken = result;
          sessionStorage.setItem('token', result);
        }
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        sessionStorage.removeItem('token');
        state.authToken = initialState.authToken;
        state.isLoading = initialState.isLoading;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = initialState.isLoading;
      })
      .addCase(logout.fulfilled, (state) => {
        sessionStorage.removeItem('token');
        state.authToken = initialState.authToken;
        state.isLoading = initialState.isLoading;
      });
  },
});

export const authSliceActions = {
  ...authSlice.actions,
  login,
  logout,
};
