import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationApi, PeriodApi } from "~/api";
import { appDayjs, formatDateOnly, convertToDatePayload } from "~/utils";
import { createAppAsyncThunk } from "~/hooks";
import {
  IAvailableBookingPeriod,
  IBookingInfo,
  ICreateBookingParams,
  BookingType,
  CustomerBookingDialog,
  Gender,
  SocketTopic
} from "~/types";

const name = "customerReservation";

interface ICustomerBookingSliceState {
  step: number;
  token?: string;
  availableBookings: string[];
  choosedDate: appDayjs.Dayjs;
  availablePeriods: IAvailableBookingPeriod[];
  reservationParams: ICreateBookingParams;
  reservationPhone: string;
  dialog: CustomerBookingDialog | undefined;
  isAgreedPrivacyPolicy: boolean;
  isLoading: boolean;
}

const initialState: ICustomerBookingSliceState = {
  step: 0,
  availableBookings: [],
  token: "",
  choosedDate: appDayjs(),
  availablePeriods: [],
  reservationParams: {
    id: "",
    reservedAt: "",
    user: {
      name: "",
      gender: Gender.OTHER,
      type: BookingType.ONLINE_BOOKING,
      phone: "",
      email: "",
      remark: "",
      adults: 1,
      children: 0
    }
  },
  reservationPhone: "",
  dialog: undefined,
  isAgreedPrivacyPolicy: false,
  isLoading: false
};

export const getBookingPeriods = createAppAsyncThunk(`${name}/getBookingPeriods`, async (arg, { rejectWithValue }) => {
  try {
    const { result } = await PeriodApi.getPeriods();
    const availableBookings = [
      ...new Set(result?.periods?.map((item: any) => formatDateOnly(item.periodStartedAt)) ?? [])
    ] as string[];
    return { availableBookings };
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getBookingPeriodByDate = createAppAsyncThunk(
  `${name}/getBookingPeriodByDate`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      const choosedDate = getState().customerReservation.choosedDate;
      const { result } = await PeriodApi.getPeriodByDate({
        date: convertToDatePayload(choosedDate),
        excludeTime: false
      });
      const availablePeriods = result?.periods ?? [];
      return { availablePeriods };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postBookingReservation = createAppAsyncThunk(
  `${name}/postBookingReservation`,
  async (arg, { getState, rejectWithValue }) => {
    try {
      const reservationParams = getState().customerReservation.reservationParams;
      const socket = getState().socket.socket;

      const response = await ReservationApi.postReservation({
        type: "OnlineBooking",
        amount: reservationParams.user.adults + reservationParams.user.children,
        options: reservationParams.user,
        periodStartedAt: new Date(reservationParams.reservedAt)
      });

      socket && socket.emit(SocketTopic.RESERVATION, response);

      return response.result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const getBookingRecord = createAppAsyncThunk(
  `${name}/getBookingRecord`,
  async (reservationPhone: string, { rejectWithValue, dispatch }) => {
    try {
      // [TODO]
      // const { result } = await ReservationApi.getReservationByPhone(reservationPhone);
      const bookingRecordRes = await fetch(`/data/dummyBookingRecord.json`);
      const bookingRecord = (await bookingRecordRes.json()) as IBookingInfo;
      dispatch(setDialog(CustomerBookingDialog.REMINDER));
      return { bookingRecord };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const customerBookingSlice = createSlice({
  name,
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<ICustomerBookingSliceState["step"]>) => {
      state.step = action.payload;
    },
    setToken: (state, action: PayloadAction<ICustomerBookingSliceState["token"]>) => {
      state.token = action.payload;
    },
    setDate: (state, action: PayloadAction<ICustomerBookingSliceState["choosedDate"]>) => {
      state.choosedDate = action.payload;
      state.reservationParams.reservedAt =
        state.availablePeriods[0]?.periodStartedAt ?? initialState.reservationParams.reservedAt;
      state.reservationParams.user.adults = initialState.reservationParams.user.adults;
    },
    setReservedAt: (state, action: PayloadAction<IBookingInfo["reservedAt"]>) => {
      state.reservationParams.reservedAt = action.payload;
      state.reservationParams.user.adults = initialState.reservationParams.user.adults;
    },
    setName: (state, action: PayloadAction<IBookingInfo["name"]>) => {
      state.reservationParams.user.name = action.payload;
    },
    setGender: (state, action: PayloadAction<IBookingInfo["gender"]>) => {
      state.reservationParams.user.gender = action.payload;
    },
    setPhone: (state, action: PayloadAction<IBookingInfo["phone"]>) => {
      state.reservationParams.user.phone = action.payload;
    },
    setEmail: (state, action: PayloadAction<IBookingInfo["email"]>) => {
      state.reservationParams.user.email = action.payload;
    },
    setRemark: (state, action: PayloadAction<IBookingInfo["remark"]>) => {
      state.reservationParams.user.remark = action.payload;
    },
    setAdultsAmount: (state, action: PayloadAction<IBookingInfo["adults"]>) => {
      state.reservationParams.user.adults = action.payload;
    },
    setReservationPhone: (state, action) => {
      state.reservationPhone = action.payload;
    },
    setDialog: (state, action: PayloadAction<ICustomerBookingSliceState["dialog"]>) => {
      state.dialog = action.payload;
    },
    setAgreedPolicy: (state, action: PayloadAction<ICustomerBookingSliceState["isAgreedPrivacyPolicy"]>) => {
      state.isAgreedPrivacyPolicy = action.payload;
    },
    resetUserInfo: (state) => {
      state.reservationParams.user = initialState.reservationParams.user;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBookingPeriods.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBookingPeriods.fulfilled, (state, action) => {
        state.availableBookings = action.payload.availableBookings;
        state.isLoading = false;
      })
      .addCase(getBookingPeriodByDate.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getBookingPeriodByDate.fulfilled, (state, action) => {
        state.availablePeriods = action.payload.availablePeriods;
        state.isLoading = false;
      })
      .addCase(postBookingReservation.fulfilled, (state, action) => {
        // const { token, id, periodStartedAt, options } = action.payload;
        // state.token = token;
        // state.reservationParams.id = id;
        // state.reservationParams.reservedAt = periodStartedAt;
        // state.reservationParams.user = options;
        // state.isLoading = false;
      })
      .addCase(postBookingReservation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(postBookingReservation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getBookingPeriods.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBookingPeriodByDate.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getBookingRecord.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookingRecord.fulfilled, (state, action) => {
        const { id, reservedAt, ...rest } = action.payload.bookingRecord;
        state.reservationParams.id = id;
        state.reservationParams.reservedAt = reservedAt;
        state.reservationParams.user = rest;
        state.isLoading = false;
      })
      .addCase(getBookingRecord.rejected, (state, action) => {
        state.isLoading = false;
      });
  }
});

export const {
  setStep,
  setDate,
  setReservedAt,
  setName,
  setGender,
  setPhone,
  setEmail,
  setRemark,
  setAdultsAmount,
  setReservationPhone,
  setDialog,
  setAgreedPolicy,
  resetUserInfo
} = customerBookingSlice.actions;
