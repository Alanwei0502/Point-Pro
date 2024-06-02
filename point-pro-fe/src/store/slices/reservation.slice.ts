import { createSlice } from '@reduxjs/toolkit';
import { ReservationApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { SocketTopic, ReservationsResponse, ReservationResponse, PostReservationPayload, PatchReservationPayload } from '~/types';
import { errorHandler } from '../errorHandler';

const name = 'reservation';

interface IReservationState {}

const initialState: IReservationState = {};

export const getReservations = createAppAsyncThunk<ReservationsResponse, Date>(`${name}/getReservations`, async (payload, { rejectWithValue }) => {
  try {
    return await ReservationApi.getReservations(payload);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

// export const postReservation = createAppAsyncThunk<ReservationResponse, PostReservationPayload>(
//   `${name}/postReservation`,
//   async (payload, { getState, rejectWithValue }) => {
//     try {
//       const socket = getState().socket.socket;
//       const response = await ReservationApi.postReservation(payload);
//       socket && socket.emit(SocketTopic.RESERVATION, response);
//       return response;
//     } catch (error) {
//       errorHandler(error);
//       return rejectWithValue(error);
//     }
//   }
// );

export const patchReservationById = createAppAsyncThunk(
  `${name}/patchReservationById`,
  async (payload: PatchReservationPayload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const response = await ReservationApi.patchReservationById(payload);
      socket && socket.emit(SocketTopic.RESERVATION, response);
      return response;
    } catch (error) {
      errorHandler(error);
      return rejectWithValue(error);
    }
  },
);

export const reservationSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {},
});

export const {} = reservationSlice.actions;
