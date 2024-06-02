import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import { GenerateTokenPayload, GenerateTokenResponse, GetUserInfoResponse, LoginPayload, LoginResponse, UserInfo } from '~/types';

const name = 'auth';

interface IAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  authToken: string | null;
  userRole: UserInfo | null;
  userToken: string | null;
}

const initialState: IAuthState = {
  isLoading: false,
  isAuthenticated: false,
  authToken: null,
  userRole: null,
  userToken: null,
};

export const login = createAppAsyncThunk<LoginResponse, LoginPayload>(`${name}/login`, async (payload, { rejectWithValue }) => {
  try {
    const data = await AuthApi.login(payload);

    if (data?.result?.authToken) {
      sessionStorage.setItem('token', data.result.authToken);
    }
    return data;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const getUserInfo = createAppAsyncThunk<GetUserInfoResponse>(`${name}/getUserInfo`, async (payload, { rejectWithValue }) => {
  try {
    const data = await AuthApi.getUserInfo();
    return data;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const getUserTokenByReservationLogId = createAppAsyncThunk<GenerateTokenResponse, GenerateTokenPayload>(
  `${name}/getUserTokenByReservationLogId`,
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AuthApi.generateToken({ reservationId: payload.reservationId });
      return response;
    } catch (error) {
      errorHandler(error);
      return rejectWithValue(error);
    }
  },
);

export const authSlice = createSlice({
  name,
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<IAuthState>) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logoutSuccess(state) {
      state.isAuthenticated = false;
      state.authToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { result } = action.payload;
        if (result?.authToken) {
          state.authToken = result.authToken;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.authToken = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userRole = action.payload.result;
      })
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

export const { loginSuccess, logoutSuccess } = authSlice.actions;
