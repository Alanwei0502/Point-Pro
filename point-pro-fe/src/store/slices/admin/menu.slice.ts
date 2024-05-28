import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  ICategory,
  CategoryResponse,
  CategoriesResponse,
  PostCategoryPayload,
  ISpecialty,
  GetSpecialtyWithSpecialtyItemsResponse,
  SpecialtyResponse,
  SpecialtyItemsResponse,
  MealsResponse,
  MealResponse,
  IMeal,
  SocketTopic,
  PatchMealByIdPayload,
  IMealWithCategoryAndSpecialtyItems,
  PatchCategoriesOrderResponse,
  ISpecialtyItem,
  ISpecialtyWithSpecialtyItems,
  PatchSpecialtyPayload,
  PostSpecialtyPayload,
  PatchCategoryPayload,
  PatchSpecialtiesOrderResponse,
  DeleteSpecialtyResponse,
} from '~/types';

const name = 'menu';

interface IMenuSliceState {
  categories: ICategory[];
  meals: IMealWithCategoryAndSpecialtyItems[];
  specialties: ISpecialtyWithSpecialtyItems[];
  editMealSpecialtyItemsModal: {
    isOpen: boolean;
    data: Pick<ISpecialtyItem, 'title' | 'price' | 'position'> | null;
  };
  createCategoryModal: {
    isOpen: boolean;
  };
  deleteCategoryConfirmModal: {
    isOpen: boolean;
    data: ICategory | null;
  };
  specialtyItemsSettingModal: {
    isOpen: boolean;
    data: ISpecialtyWithSpecialtyItems[] | null;
  };
  createSpecialtyModal: {
    isOpen: boolean;
  };
  deleteSpecialtyConfirmModal: {
    isOpen: boolean;
    data: ISpecialty | null;
  };
}

const initialState: IMenuSliceState = {
  categories: [],
  meals: [],
  specialties: [],
  editMealSpecialtyItemsModal: {
    isOpen: false,
    data: null,
  },
  createCategoryModal: {
    isOpen: false,
  },
  deleteCategoryConfirmModal: {
    isOpen: false,
    data: null,
  },
  specialtyItemsSettingModal: {
    isOpen: false,
    data: null,
  },
  createSpecialtyModal: {
    isOpen: false,
  },
  deleteSpecialtyConfirmModal: {
    isOpen: false,
    data: null,
  },
};

// CATEGORY
export const getCategories = createAppAsyncThunk(`${name}/getCategories`, async (_, { rejectWithValue }) => {
  try {
    return await MenuApi.getCategories();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const postCategory = createAppAsyncThunk(`${name}/postCategory`, async (payload: PostCategoryPayload, { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.postCategory(payload);
    dispatch(closeCreateCategoryModal());
    dispatch(getCategories());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchCategory = createAppAsyncThunk(`${name}/patchCategory`, async (payload: PatchCategoryPayload, { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.patchCategory(payload);
    dispatch(getCategories());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const deleteCategory = createAppAsyncThunk(`${name}/deleteCategory`, async (payload: ICategory['id'], { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.deleteCategory(payload);
    dispatch(closeDeleteCategoryConfirmModal());
    dispatch(getCategories());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchCategoriesOrder = createAppAsyncThunk(`${name}/patchCategoriesOrder`, async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const payload = getState().menu.categories.map((c) => ({ id: c.id, position: c.position }));
    await MenuApi.patchCategoriesOrder(payload);
    dispatch(getCategories());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

// MEAL
export const getMeals = createAppAsyncThunk<MealsResponse>(`${name}/getMeals`, async (_, { rejectWithValue }) => {
  try {
    return await MenuApi.getMeals();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const getMealById = createAppAsyncThunk<MealResponse, string>(`${name}/getMealById`, async (payload, { rejectWithValue }) => {
  try {
    return await MenuApi.getMealById(payload);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const postMeal = createAppAsyncThunk<MealResponse, IMeal>(`${name}/postMeal`, async (payload, { getState, rejectWithValue }) => {
  try {
    const socket = getState().socket.socket;
    const newMeal = await MenuApi.postMeal(payload);
    socket && socket.emit(SocketTopic.MENU, newMeal);
    return newMeal;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchMealById = createAppAsyncThunk<MealResponse, PatchMealByIdPayload>(
  `${name}/patchMealById`,
  async (payload, { getState, rejectWithValue }) => {
    try {
      const socket = getState().socket.socket;
      const updatedMeal = await MenuApi.patchMealById(payload);
      socket && socket.emit(SocketTopic.MENU, updatedMeal);
      return updatedMeal;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const deleteMeal = createAppAsyncThunk<MealResponse, string>(`${name}/deleteMeal`, async (payload, { getState, rejectWithValue }) => {
  try {
    const socket = getState().socket.socket;
    const deletedMeal = await MenuApi.deleteMeal(payload);
    socket && socket.emit(SocketTopic.MENU, deletedMeal);
    return deletedMeal;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

// SPECIALTY
export const getSpecialties = createAppAsyncThunk(`${name}/getSpecialties`, async (_, { rejectWithValue }) => {
  try {
    return await MenuApi.getSpecialties();
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const postSpecialty = createAppAsyncThunk(`${name}/postSpecialty`, async (payload: PostSpecialtyPayload, { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.postSpecialty(payload);
    dispatch(getSpecialties());
    dispatch(closeCreateSpecialtyModal());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchSpecialty = createAppAsyncThunk(`${name}/patchSpecialty`, async (payload: PatchSpecialtyPayload, { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.patchSpecialty(payload);
    dispatch(getSpecialties());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const deleteSpecialty = createAppAsyncThunk(`${name}/deleteSpecialty`, async (payload: ISpecialty['id'], { rejectWithValue, dispatch }) => {
  try {
    await MenuApi.deleteSpecialty(payload);
    dispatch(closeDeleteSpecialtyConfirmModal());
    dispatch(getSpecialties());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchSpecialtiesOrder = createAppAsyncThunk(`${name}/patchSpecialtiesOrder`, async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const payload = getState().menu.specialties.map((s) => ({ id: s.id, position: s.position }));
    await MenuApi.patchSpecialtiesOrder(payload);
    dispatch(getSpecialties());
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

// SPECIALTY ITEM
export const patchSpecialtyItemsOrder = createAppAsyncThunk(
  `${name}/patchSpecialtyItemsOrder`,
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const specialties = getState().menu.specialties;
      const payload = specialties.flatMap((s) => s.specialtyItems.map((si) => ({ id: si.id, position: si.position })));
      // await MenuApi.patchSpecialtyItemsOrder(payload);
      dispatch(getSpecialties());
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const menuSlice = createSlice({
  name,
  initialState,
  reducers: {
    // CATEGORY
    setCategories: (state, action: PayloadAction<IMenuSliceState['categories']>) => {
      state.categories = action.payload;
    },
    openCreateCategoryModal: (state) => {
      state.createCategoryModal.isOpen = true;
    },
    closeCreateCategoryModal: (state) => {
      state.createCategoryModal = initialState.createCategoryModal;
    },
    openDeleteCategoryConfirmModal: (state, action: PayloadAction<ICategory>) => {
      state.deleteCategoryConfirmModal.isOpen = true;
      state.deleteCategoryConfirmModal.data = action.payload;
    },
    closeDeleteCategoryConfirmModal: (state) => {
      state.deleteCategoryConfirmModal = initialState.deleteCategoryConfirmModal;
    },
    // MEAL
    setMeals: (state, action: PayloadAction<IMenuSliceState['meals']>) => {
      state.meals = action.payload;
    },
    // SPECIALTY
    setSpecialties: (state, action: PayloadAction<IMenuSliceState['specialties']>) => {
      state.specialties = action.payload;
    },
    openCreateSpecialtyModal: (state) => {
      state.createSpecialtyModal.isOpen = true;
    },
    closeCreateSpecialtyModal: (state) => {
      state.createSpecialtyModal = initialState.createSpecialtyModal;
    },
    openDeleteSpecialtyConfirmModal: (state, action: PayloadAction<ISpecialty>) => {
      state.deleteSpecialtyConfirmModal.isOpen = true;
      state.deleteSpecialtyConfirmModal.data = action.payload;
    },
    closeDeleteSpecialtyConfirmModal: (state) => {
      state.deleteSpecialtyConfirmModal = initialState.deleteSpecialtyConfirmModal;
    },
    // SPECIALTY ITEM
    setSpecialtyItems: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems['specialtyItems']>) => {
      state.specialties = state.specialties.map((s) => {
        if (s.id === action.payload[0].specialtyId) {
          s.specialtyItems = action.payload;
          return s;
        }
        return s;
      });
    },
    openSpecialtyItemsSettingModal: (state) => {
      state.specialtyItemsSettingModal.isOpen = true;
      state.specialtyItemsSettingModal.data = state.specialties;
    },
    setSpecialtyItemsSettingModalData: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems[]>) => {
      state.specialtyItemsSettingModal.data = action.payload;
    },
    closeSpecialtyItemsSettingModal: (state) => {
      state.specialtyItemsSettingModal = initialState.specialtyItemsSettingModal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, { payload }) => {
        state.categories = payload.result ?? [];
      })
      .addCase(getMeals.fulfilled, (state, { payload }) => {
        state.meals = payload.result ?? [];
      })
      .addCase(getSpecialties.fulfilled, (state, { payload }) => {
        state.specialties = payload.result ?? [];
      });
  },
});

export const {
  // CATEGORY
  setCategories,
  openCreateCategoryModal,
  closeCreateCategoryModal,
  openDeleteCategoryConfirmModal,
  closeDeleteCategoryConfirmModal,
  // MEAL
  setMeals,
  // SPECIALTY
  setSpecialties,
  openCreateSpecialtyModal,
  closeCreateSpecialtyModal,
  openDeleteSpecialtyConfirmModal,
  closeDeleteSpecialtyConfirmModal,
  // SPECIALTY ITEM
  setSpecialtyItems,
  setSpecialtyItemsSettingModalData,
  openSpecialtyItemsSettingModal,
  closeSpecialtyItemsSettingModal,
} = menuSlice.actions;
