// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { MailerApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks/useRedux";
import { MailerRequestBody } from "~/types/api";

const name = "mail";

interface IMailerState {}

const initialState: IMailerState = {};

export const sendMail = createAppAsyncThunk(
  `${name}/sendMailRequest`,
  async (payload: MailerRequestBody, { rejectWithValue }) => {
    try {
      return await MailerApi.sendMailRequest(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const mailerSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendMail.fulfilled, (state, action) => {
      console.log(action.payload);
    });
  }
});
