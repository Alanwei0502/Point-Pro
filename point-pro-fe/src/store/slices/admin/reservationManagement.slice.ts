import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PeriodApi, ReservationApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { AvailablePeriod, Gender, IReservation, ReservationInfo, ReservationModalType, ReservationType } from '~/types';
import { appDayjs } from '~/utils';

const sliceName = 'reservationManagement';

export interface IReservationModalData extends Pick<IReservation, 'type' | 'username' | 'phone' | 'email' | 'gender' | 'people' | 'remark'> {
  id: IReservation['id'] | null;
  selectedPeriod: Pick<AvailablePeriod, 'id' | 'startTime'> | null;
}

export interface IReservationManagementSliceState {
  // TABLE
  loading: boolean;
  dateFilter: string;
  reservations: ReservationInfo[];
  // MODAL
  availableTime: AvailablePeriod[];
  reservationModal: {
    modalType: ReservationModalType | null;
    isOpen: boolean;
    modalSelectedDate: string;
    data: IReservationModalData;
  };
  deleteReservationConfirmModal: {
    isOpen: boolean;
    data: Pick<IReservation, 'id' | 'username' | 'gender'> | null;
  };
  startDiningConfirmModal: {
    isOpen: boolean;
    data: Pick<IReservation, 'id' | 'username' | 'gender'> | null;
  };
}

const initialState: IReservationManagementSliceState = {
  // TABLE
  loading: false,
  dateFilter: appDayjs().toDate().toDateString(),
  reservations: [],
  // MODAL
  availableTime: [],
  reservationModal: {
    modalType: null,
    isOpen: false,
    modalSelectedDate: appDayjs().toDate().toDateString(),
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
  deleteReservationConfirmModal: {
    isOpen: false,
    data: null,
  },
  startDiningConfirmModal: {
    isOpen: false,
    data: null,
  },
};

const getReservations = createAppAsyncThunk(`${sliceName}/getReservations`, async (payload: string | Date, thunkApi) => {
  try {
    const param = appDayjs(payload).toISOString();
    console.log({ param });

    const res = await ReservationApi.getReservations(appDayjs(payload).toISOString());
    return res;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const getAvailablePeriods = createAppAsyncThunk(`${sliceName}/getAvailablePeriods`, async (_, thunkApi) => {
  try {
    const result = await PeriodApi.getAvailablePeriods();
    return result?.result ?? [];
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postReservation = createAppAsyncThunk(`${sliceName}/postReservation`, async (payload: IReservationModalData, thunkApi) => {
  try {
    const { id, selectedPeriod, ...restPayload } = payload;
    const response = await ReservationApi.postReservation({ ...restPayload, periodId: selectedPeriod?.id as string });
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchReservation = createAppAsyncThunk(`${sliceName}/patchReservation`, async (payload: IReservationModalData, thunkApi) => {
  try {
    const { id, selectedPeriod, ...restPayload } = payload;
    const response = await ReservationApi.patchReservation({ ...restPayload, periodId: selectedPeriod?.id as string, id: id as string });
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const startDiningReservation = createAppAsyncThunk(`${sliceName}/startDiningReservation`, async (_, thunkApi) => {
  try {
    const data = thunkApi.getState().reservationManagement.startDiningConfirmModal.data;
    const id = data?.id as string;
    const response = await ReservationApi.startDiningReservation(id);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const deleteReservation = createAppAsyncThunk(`${sliceName}/deleteReservation`, async (id: IReservation['id'], thunkApi) => {
  try {
    const response = await ReservationApi.deleteReservation(id);
    return response;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const reservationManagementSlice = createSlice({
  name: sliceName,
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
    },
    openModal: (
      state,
      action: PayloadAction<{ modalType: ReservationModalType; data?: IReservationManagementSliceState['reservationModal']['data'] }>,
    ) => {
      state.reservationModal.isOpen = true;
      state.reservationModal.modalSelectedDate = state.dateFilter;
      state.reservationModal.modalType = action.payload.modalType;
      state.reservationModal.data = action.payload.data ?? initialState.reservationModal.data;
    },
    closeModal: (state) => {
      state.reservationModal = initialState.reservationModal;
    },
    openDeleteReservationConfirmModal: (state, action: PayloadAction<IReservationManagementSliceState['deleteReservationConfirmModal']['data']>) => {
      state.deleteReservationConfirmModal.isOpen = true;
      state.deleteReservationConfirmModal.data = action.payload;
    },
    closeDeleteReservationConfirmModal: (state) => {
      state.deleteReservationConfirmModal = initialState.deleteReservationConfirmModal;
    },
    openStartDiningConfirmModal: (state, action: PayloadAction<IReservationManagementSliceState['startDiningConfirmModal']['data']>) => {
      state.startDiningConfirmModal.isOpen = true;
      state.startDiningConfirmModal.data = action.payload;
    },
    closeStartDiningConfirmModal: (state) => {
      state.startDiningConfirmModal = initialState.startDiningConfirmModal;
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
  startDiningReservation,
  deleteReservation,
};
