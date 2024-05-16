// Libs
import { createSlice } from "@reduxjs/toolkit";
// Others
import { MealApi } from "~/api";
import { createAppAsyncThunk } from "~/hooks/useRedux";
import { IMeal, SocketTopic } from "~/types";
import { MealsResponse, MealResponse, PatchMealByIdPayload } from "~/types";

const name = "meal";

interface IMealState {}

const initialState: IMealState = {};

export const getMeals = createAppAsyncThunk<MealsResponse>(`${name}/getMeals`, async (payload, { rejectWithValue }) => {
  try {
    return await MealApi.getMeals();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: "unknown error" });
    }
  }
});

export const getMealById = createAppAsyncThunk<MealResponse, string>(
  `${name}/getMealById`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MealApi.getMealById(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const postMeal = createAppAsyncThunk<MealResponse, IMeal>(
  `${name}/postMeal`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const newMeal = await MealApi.postMeal(payload);
      socket && socket.emit(SocketTopic.MENU, newMeal);
      return newMeal;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const patchMealById = createAppAsyncThunk<MealResponse, PatchMealByIdPayload>(
  `${name}/patchMealById`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const updatedMeal = await MealApi.patchMealById(payload);
      socket && socket.emit(SocketTopic.MENU, updatedMeal);
      return updatedMeal;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const deleteMeal = createAppAsyncThunk<MealResponse, string>(
  `${name}/deleteMeal`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const deletedMeal = await MealApi.deleteMeal(payload);
      socket && socket.emit(SocketTopic.MENU, deletedMeal);
      return deletedMeal;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: "unknown error" });
      }
    }
  }
);

export const mealSlice = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: {}
});

export const {} = mealSlice.actions;
