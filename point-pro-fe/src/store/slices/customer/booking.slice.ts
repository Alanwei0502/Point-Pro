import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ReservationApi, PeriodApi } from '~/api';
import { appDayjs } from '~/utils';
import { createAppAsyncThunk } from '~/hooks';
import { MobileBookingDialog, Gender, IReservation, AvailablePeriod, PostReservationPayload } from '~/types';

const sliceName = 'booking';

interface ICustomerBookingSliceState {
  isLoading: boolean;
  step: number;
  availableTime: AvailablePeriod[];
  selectedDate: string;
  selectedPeriod: Pick<AvailablePeriod, 'id' | 'startTime'> | null;
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
  selectedDate: appDayjs().toISOString(),
  selectedPeriod: null,
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

const getAvailablePeriods = createAppAsyncThunk(`${sliceName}/getAvailablePeriods`, async (_, thunkApi) => {
  try {
    const res = await PeriodApi.getAvailablePeriods();
    return res?.result ?? [];
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postReservation = createAppAsyncThunk(`${sliceName}/postReservation`, async (payload: PostReservationPayload, thunkApi) => {
  try {
    const response = await ReservationApi.postReservation(payload);

    return response.result;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const bookingSlice = createSlice({
  name: sliceName,
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
    setPeople: (state, action: PayloadAction<ICustomerBookingSliceState['people']>) => {
      state.people = action.payload;
    },
    setName: (state, action: PayloadAction<ICustomerBookingSliceState['username']>) => {
      state.username = action.payload;
    },
    setGender: (state, action: PayloadAction<ICustomerBookingSliceState['gender']>) => {
      state.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<ICustomerBookingSliceState['phone']>) => {
      state.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<ICustomerBookingSliceState['email']>) => {
      state.email = action.payload;
    },
    setRemark: (state, action: PayloadAction<ICustomerBookingSliceState['remark']>) => {
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

export const bookingSliceActions = {
  ...bookingSlice.actions,
  getAvailablePeriods,
  postReservation,
};

export default bookingSlice;
