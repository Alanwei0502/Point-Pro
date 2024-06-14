import { createSlice } from '@reduxjs/toolkit';
import { AuthApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { LoginPayload, LoginResponse, UserInfo } from '~/types';

const name = 'auth';

interface IAuthState {
  isLoading: boolean;
  authToken: string | null;
  userRole: UserInfo | null;
  userToken: string | null;
}

const initialState: IAuthState = {
  isLoading: false,
  authToken: null,
  userRole: null,
  userToken: null,
};

const login = createAppAsyncThunk<LoginResponse, LoginPayload>(`${name}/login`, async (payload, thunkApi) => {
  try {
    const response = await AuthApi.login(payload);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const logout = createAppAsyncThunk(`${name}/logout`, async (_, thunkApi) => {
  try {
    await AuthApi.logout();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = initialState.isLoading;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { result } = action.payload;
        if (result) {
          state.authToken = result;
          localStorage.setItem('token', result);
        }
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        localStorage.removeItem('token');
        state.authToken = initialState.authToken;
        state.isLoading = initialState.isLoading;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = initialState.isLoading;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.removeItem('token');
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
