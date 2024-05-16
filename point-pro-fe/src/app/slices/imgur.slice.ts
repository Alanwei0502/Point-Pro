// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { ImgurApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks/useRedux";
import { updateImgPayload, updateImgResponse } from "~/types/api";

const name = "imgur";

interface ImgurState {}

const initialState: ImgurState = {};

export const uploadImg = createAppAsyncThunk<updateImgResponse, updateImgPayload>(
  `${name}/uploadImg`,
  async (payload, { rejectWithValue }) => {
    try {
      return await ImgurApi.uploadImg(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const imgurSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = imgurSlice.actions;
