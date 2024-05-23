import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationApi, PeriodApi } from '~/api';
import { appDayjs, formatDateOnly, convertToDatePayload } from '~/utils';
import { createAppAsyncThunk } from '~/hooks';
import {
  IAvailableBookingPeriod,
  IBookingInfo,
  ICreateBookingParams,
  BookingType,
  CustomerBookingDialog,
  Gender,
  SocketTopic,
  IPeriod,
} from '~/types';

const name = 'booking';

interface ICustomerBookingSliceState {
  isLoading: boolean;
  step: number;
  availableTime: IPeriod[];
  selectedDate: appDayjs.Dayjs;
  selectedPeriod: IPeriod | undefined;
  people: number;
  username: string;
  phone: string;
  email: string;
  gender: Gender;
  remark: string;
  isAgreedPrivacyPolicy: boolean;

  token?: string;
  dialog: CustomerBookingDialog | undefined;
}

const initialState: ICustomerBookingSliceState = {
  isLoading: false,
  step: 0,
  availableTime: [],
  selectedDate: appDayjs().add(1, 'day'),
  selectedPeriod: undefined,
  people: 0,
  username: '',
  phone: '',
  email: '',
  gender: Gender.OTHER,
  remark: '',
  isAgreedPrivacyPolicy: false,

  token: '',
  dialog: undefined,
};

export const getAvailablePeriods = createAppAsyncThunk(
  `${name}/getAvailablePeriods`,
  async (_, { rejectWithValue }) => {
    try {
      const result = await PeriodApi.getAvailablePeriods();
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const postBookingReservation = createAppAsyncThunk(
  `${name}/postBookingReservation`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      const { username, gender, phone, email, remark, people, selectedPeriod } = getState().booking;
      const socket = getState().socket.socket;

      // const response = await ReservationApi.postReservation({
      //   type: 'OnlineBooking',
      //   amount: people,
      //   startTime: new Date(reservationParams.reservedAt),
      // });

      // socket && socket.emit(SocketTopic.RESERVATION, response);

      // return response.result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const getBookingRecord = createAppAsyncThunk(
  `${name}/getBookingRecord`,
  async (phone: string, { rejectWithValue, dispatch }) => {
    try {
      // [TODO]
      // const { result } = await ReservationApi.getReservationByPhone(phone);
      const bookingRecordRes = await fetch(`/data/dummyBookingRecord.json`);
      const bookingRecord = (await bookingRecordRes.json()) as IBookingInfo;
      dispatch(setDialog(CustomerBookingDialog.REMINDER));
      return { bookingRecord };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

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
    setSelectedPeople: (state, action: PayloadAction<IBookingInfo['adults']>) => {
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
    finishBooking: (state) => {
      state = initialState;
    },
    confirmPrivacyPolicyDialog: (state) => {
      state.dialog = initialState.dialog;
      state.isAgreedPrivacyPolicy = true;
    },
    closeBookingRecordQueryDialog: (state) => {
      state.phone = initialState.phone;
      state.dialog = initialState.dialog;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailablePeriods.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAvailablePeriods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableTime = action.payload?.result ?? [];
      })
      .addCase(getAvailablePeriods.rejected, (state, action) => {
        state.isLoading = initialState.isLoading;
        state.availableTime = initialState.availableTime;
      })
      .addCase(postBookingReservation.fulfilled, (state, action) => {
        // const { token, id, startTime, options } = action.payload;
        // state.token = token;
        // state.reservationParams.id = id;
        // state.reservationParams.reservedAt = startTime;
        // state.reservationParams.user = options;
        // state.isLoading = false;
      })
      .addCase(postBookingReservation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postBookingReservation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getBookingRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingRecord.fulfilled, (state, action) => {
        const { id, reservedAt, ...rest } = action.payload.bookingRecord;
        // state.reservationParams.id = id;
        // state.reservationParams.reservedAt = reservedAt;
        // state.reservationParams.user = rest;
        state.isLoading = false;
      })
      .addCase(getBookingRecord.rejected, (state, action) => {
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
  setSelectedPeople,
  setDialog,
  setAgreedPolicy,
  finishBooking,
  closeBookingRecordQueryDialog,
  confirmPrivacyPolicyDialog,
} = bookingSlice.actions;
