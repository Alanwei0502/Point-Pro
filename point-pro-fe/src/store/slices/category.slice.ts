// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { CategoryApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks";
import { ICategory, CategoryResponse, CategoriesResponse, PostCategoryPayload } from "~/types";

const name = "category";

interface ICategoryState {
  categories: ICategory[];
}

const initialState: ICategoryState = {
  categories: []
};

export const getCategories = createAppAsyncThunk<CategoriesResponse>(
  `${name}/getCategories`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.getCategories();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postCategory = createAppAsyncThunk<CategoryResponse, PostCategoryPayload>(
  `${name}/postCategory`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.postCategory(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteCategory = createAppAsyncThunk<CategoryResponse, string>(
  `${name}/deleteCategory`,
  async (payload, { rejectWithValue }) => {
    try {
      return await CategoryApi.deleteCategory(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const categorySlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.categories = payload.result;
    });
  }
});

export const {} = categorySlice.actions;
