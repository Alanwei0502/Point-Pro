import { createSlice } from '@reduxjs/toolkit';
import { MailerApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import { MailerRequestBody } from '~/types';

const name = 'mail';

interface IMailerState {}

const initialState: IMailerState = {};

export const sendMail = createAppAsyncThunk(`${name}/sendMailRequest`, async (payload: MailerRequestBody, { rejectWithValue }) => {
  try {
    return await MailerApi.sendMailRequest(payload);
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const mailerSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendMail.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  },
});
