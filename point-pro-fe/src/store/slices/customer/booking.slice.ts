import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationApi, PeriodApi } from '~/api';
import { appDayjs } from '~/utils';
import { createAppAsyncThunk } from '~/hooks';
import { IBookingInfo, ReservationType, MobileBookingDialog, Gender, SocketTopic, IReservation, AvailablePeriod } from '~/types';

const name = 'booking';

interface ICustomerBookingSliceState {
  isLoading: boolean;
  step: number;
  availableTime: AvailablePeriod[];
  selectedDate: appDayjs.Dayjs;
  selectedPeriod: Pick<AvailablePeriod, 'id' | 'startTime'> | null;
  type: ReservationType;
  people: IReservation['people'];
  username: IReservation['username'];
  phone: IReservation['phone'];
  email: IReservation['email'];
  gender: IReservation['gender'];
  remark: IReservation['remark'];
  isAgreedPrivacyPolicy: boolean;
  dialog: MobileBookingDialog | null;

  token?: string;
}

const initialState: ICustomerBookingSliceState = {
  isLoading: false,
  step: 0,
  availableTime: [],
  selectedDate: appDayjs(),
  selectedPeriod: null,
  type: ReservationType.ONLINE,
  people: 0,
  username: '',
  phone: '',
  email: null,
  gender: Gender.OTHER,
  remark: null,
  isAgreedPrivacyPolicy: false,
  dialog: null,

  token: '',
};

export const getAvailablePeriods = createAppAsyncThunk(`${name}/getAvailablePeriods`, async (_, thunkApi) => {
  try {
    const result = await PeriodApi.getAvailablePeriods();
    return result?.result ?? [];
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const postReservation = createAppAsyncThunk(`${name}/postReservation`, async (_, { getState, rejectWithValue }) => {
  try {
    const { username, gender, phone, email, remark, people, selectedPeriod, type } = getState().booking;
    const periodId = selectedPeriod?.id;

    if (!periodId) return;

    const response = await ReservationApi.postReservation({
      username,
      gender,
      phone,
      email,
      remark,
      people,
      periodId,
      type,
    });

    const socket = getState().socket.socket;
    socket && socket.emit(SocketTopic.RESERVATION, response.result);

    return response.result;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const bookingSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ICustomerBookingSliceState['step']>) => {
      state.step = action.payload;
    },
    setToken: (state, action: PayloadAction<ICustomerBookingSliceState['token']>) => {
      state.token = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<ICustomerBookingSliceState['selectedDate']>) => {
      state.selectedDate = action.payload;
      state.selectedPeriod = initialState.selectedPeriod;
      state.people = initialState.people;
    },
    setSelectedPeriod: (state, action: PayloadAction<ICustomerBookingSliceState['selectedPeriod']>) => {
      state.selectedPeriod = action.payload;
      state.people = initialState.people;
    },
    setPeople: (state, action: PayloadAction<IBookingInfo['adults']>) => {
      state.people = action.payload;
    },
    setName: (state, action: PayloadAction<IBookingInfo['name']>) => {
      state.username = action.payload;
    },
    setGender: (state, action: PayloadAction<IBookingInfo['gender']>) => {
      state.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<IBookingInfo['phone']>) => {
      state.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<IBookingInfo['email']>) => {
      state.email = action.payload;
    },
    setRemark: (state, action: PayloadAction<IBookingInfo['remark']>) => {
      state.remark = action.payload;
    },
    setDialog: (state, action: PayloadAction<ICustomerBookingSliceState['dialog']>) => {
      state.dialog = action.payload;
    },
    setAgreedPolicy: (state, action: PayloadAction<ICustomerBookingSliceState['isAgreedPrivacyPolicy']>) => {
      state.isAgreedPrivacyPolicy = action.payload;
    },
    confirmPrivacyPolicyDialog: (state) => {
      state.dialog = initialState.dialog;
      state.isAgreedPrivacyPolicy = true;
    },
    closeBookingRecordQueryDialog: (state) => {
      state.phone = initialState.phone;
      state.dialog = initialState.dialog;
    },
    finishBooking: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailablePeriods.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAvailablePeriods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTime = action.payload;
      })
      .addCase(getAvailablePeriods.rejected, (state) => {
        state.isLoading = initialState.isLoading;
        state.availableTime = initialState.availableTime;
      })
      .addCase(postReservation.fulfilled, (state) => {
        state.isLoading = false;
        state.dialog = MobileBookingDialog.REMINDER;
      })
      .addCase(postReservation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(postReservation.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStep,
  setSelectedDate,
  setSelectedPeriod,
  setName,
  setGender,
  setPhone,
  setEmail,
  setRemark,
  setPeople,
  setDialog,
  setAgreedPolicy,
  closeBookingRecordQueryDialog,
  confirmPrivacyPolicyDialog,
  finishBooking,
} = bookingSlice.actions;
