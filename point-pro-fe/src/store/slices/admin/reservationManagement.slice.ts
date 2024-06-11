import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PeriodApi, ReservationApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { AvailablePeriod, Gender, IReservation, ReservationInfo, ReservationType, SocketTopic } from '~/types';
import { appDayjs } from '~/utils';

const name = 'reservationManagement';

export enum ReservationModalType {
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export interface IReservationModalData extends Pick<IReservation, 'type' | 'username' | 'phone' | 'email' | 'gender' | 'people' | 'remark'> {
  id: IReservation['id'] | null;
  selectedPeriod: Pick<AvailablePeriod, 'id' | 'startTime'> | null;
}

export interface IReservationManagementSliceState {
  // TABLE
  loading: boolean;
  dateFilter: Date;
  reservations: ReservationInfo[];
  // MODAL
  availableTime: AvailablePeriod[];
  reservationModal: {
    type: ReservationModalType | null;
    isOpen: boolean;
    modalSelectedDate: Date;
    data: IReservationModalData;
  };
}

const initialState: IReservationManagementSliceState = {
  // TABLE
  loading: false,
  dateFilter: appDayjs().toDate(),
  reservations: [],
  // MODAL
  availableTime: [],
  reservationModal: {
    type: null,
    isOpen: false,
    modalSelectedDate: appDayjs().toDate(),
    data: {
      id: null,
      type: ReservationType.PHONE,
      username: '',
      phone: '',
      email: null,
      gender: Gender.OTHER,
      remark: null,
      people: 0,
      selectedPeriod: null,
    },
  },
};

const getReservations = createAppAsyncThunk(`${name}/getReservations`, async (payload: Date, thunkApi) => {
  try {
    const res = await ReservationApi.getReservations(payload);
    return res;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const getAvailablePeriods = createAppAsyncThunk(`${name}/getAvailablePeriods`, async (_, thunkApi) => {
  try {
    const result = await PeriodApi.getAvailablePeriods();
    return result?.result ?? [];
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postReservation = createAppAsyncThunk(`${name}/postReservation`, async (_, thunkApi) => {
  try {
    const { id, selectedPeriod, ...restPayload } = thunkApi.getState().reservationManagement.reservationModal.data;
    const payload = { ...restPayload, periodId: selectedPeriod?.id as string };
    const response = await ReservationApi.postReservation(payload);
    const socket = thunkApi.getState().socket.socket;
    socket && socket.emit(SocketTopic.RESERVATION, response);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchReservation = createAppAsyncThunk(`${name}/patchReservation`, async (_, thunkApi) => {
  try {
    const { id, selectedPeriod, ...restPayload } = thunkApi.getState().reservationManagement.reservationModal.data;
    const payload = { ...restPayload, periodId: selectedPeriod?.id as string, id: id as string };
    const response = await ReservationApi.patchReservation(payload);
    const socket = thunkApi.getState().socket.socket;
    socket && socket.emit(SocketTopic.RESERVATION, response);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const deleteReservation = createAppAsyncThunk(`${name}/deleteReservation`, async (_, thunkApi) => {
  try {
    const id = thunkApi.getState().reservationManagement.reservationModal.data.id as string;
    const response = await ReservationApi.deleteReservation(id);
    const socket = thunkApi.getState().socket.socket;
    socket && socket.emit(SocketTopic.RESERVATION, response);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const reservationManagementSlice = createSlice({
  name,
  initialState,
  reducers: {
    setDateFilter: (state, action) => {
      state.dateFilter = action.payload;
    },
    setModalSelectedDate: (state, action: PayloadAction<IReservationManagementSliceState['reservationModal']['modalSelectedDate']>) => {
      state.reservationModal.modalSelectedDate = action.payload;
      state.reservationModal.data.selectedPeriod = initialState.reservationModal.data.selectedPeriod;
      state.reservationModal.data.people = initialState.reservationModal.data.people;
    },
    setModalData: (state, action: PayloadAction<IReservationManagementSliceState['reservationModal']['data']>) => {
      state.reservationModal.data = action.payload;
      console.log('setModalData', state.reservationModal.data);
    },
    openModal: (
      state,
      action: PayloadAction<{ type: ReservationModalType; data?: IReservationManagementSliceState['reservationModal']['data'] }>,
    ) => {
      state.reservationModal.isOpen = true;
      state.reservationModal.modalSelectedDate = state.dateFilter;
      state.reservationModal.type = action.payload.type;
      state.reservationModal.data = action.payload.data ?? initialState.reservationModal.data;
    },
    closeModal: (state) => {
      state.reservationModal = initialState.reservationModal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReservations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getReservations.fulfilled, (state, action) => {
        state.loading = false;
        const reservations = action.payload.result ?? [];
        state.reservations = reservations;
      })
      .addCase(getReservations.rejected, (state) => {
        state.loading = initialState.loading;
        state.reservations = initialState.reservations;
      })
      .addCase(getAvailablePeriods.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAvailablePeriods.fulfilled, (state, action) => {
        state.loading = false;
        state.availableTime = action.payload;
      })
      .addCase(getAvailablePeriods.rejected, (state) => {
        state.loading = initialState.loading;
        state.availableTime = initialState.availableTime;
      });
  },
});

export const reservationManagementSliceActions = {
  ...reservationManagementSlice.actions,
  getAvailablePeriods,
  getReservations,
  postReservation,
  patchReservation,
  deleteReservation,
};
