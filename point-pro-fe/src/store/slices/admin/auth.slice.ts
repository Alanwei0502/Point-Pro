import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import { GenerateTokenPayload, GenerateTokenResponse, LoginPayload, LoginResponse, UserInfo } from '~/types';

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

export const getUserTokenByReservationLogId = createAppAsyncThunk<GenerateTokenResponse, GenerateTokenPayload>(
  `${name}/getUserTokenByReservationLogId`,
  async (payload, thunkApi) => {
    try {
      const response = await AuthApi.generateToken({ reservationId: payload.reservationId });
      return response;
    } catch (error) {
      errorHandler(error);
      return thunkApi.rejectWithValue(error);
    }
  },
);

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
      })
      // .addCase(getUserInfo.fulfilled, (state, action) => {
      //   state.userRole = action.payload.result;
      // })
      .addCase(getUserTokenByReservationLogId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserTokenByReservationLogId.fulfilled, (state, action) => {
        state.userToken = action?.payload?.result?.token ?? null; // TODO
        state.isLoading = true;
      })
      .addCase(getUserTokenByReservationLogId.rejected, (state) => {
        state.userToken = initialState.userToken;
      });
  },
});

export const authSliceActions = {
  ...authSlice.actions,
  login,
  logout,
  // getUserInfo,
  getUserTokenByReservationLogId,
};
