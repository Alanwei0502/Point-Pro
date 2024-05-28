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
  PostCategoiesOrderPayload,
  ISpecialtyItem,
  ISpecialtyWithSpecialtyItems,
  PatchSpecialtyPayload,
} from '~/types';

const name = 'menu';

interface IMenuSliceState {
  needUpdateDb: boolean;
  categories: ICategory[];
  meals: IMealWithCategoryAndSpecialtyItems[];
  specialties: ISpecialtyWithSpecialtyItems[];
  editMealSpecialtyItemsModal: {
    isOpen: boolean;
    data: Pick<ISpecialtyItem, 'title' | 'price' | 'position'> | null;
  };
  createCategoryModal: {
    isOpen: boolean;
    data: Pick<ICategory, 'title' | 'position'> | null;
  };
  deleteCategoryConfirmModal: {
    isOpen: boolean;
    data: ICategory | null;
  };
  specialtyItemsSettingModal: {
    isOpen: boolean;
    data: ISpecialtyWithSpecialtyItems[] | null;
  };
}

const initialState: IMenuSliceState = {
  needUpdateDb: false,
  categories: [],
  meals: [],
  specialties: [],
  editMealSpecialtyItemsModal: {
    isOpen: false,
    data: null,
  },
  createCategoryModal: {
    isOpen: false,
    data: null,
  },
  deleteCategoryConfirmModal: {
    isOpen: false,
    data: null,
  },
  specialtyItemsSettingModal: {
    isOpen: false,
    data: null,
  },
};

export const getCategories = createAppAsyncThunk<CategoriesResponse>(`${name}/getCategories`, async (_, { rejectWithValue }) => {
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

export const postCategory = createAppAsyncThunk<CategoryResponse, PostCategoryPayload>(
  `${name}/postCategory`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await MenuApi.postCategory(payload);
      dispatch(closeCreateCategoryModal());
      dispatch(getCategories());
      return res;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const patchCategory = createAppAsyncThunk<CategoryResponse, Pick<ICategory, 'id' | 'title'>>(
  `${name}/patchCategory`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const { id, title } = payload;
      const res = await MenuApi.patchCategory(id, { title });
      dispatch(getCategories());
      return res;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const deleteCategory = createAppAsyncThunk<CategoryResponse, ICategory['id']>(
  `${name}/deleteCategory`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const res = await MenuApi.deleteCategory(payload);
      dispatch(closeDeleteCategoryConfirmModal());
      dispatch(getCategories());
      return res;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const patchCategoriesOrder = createAppAsyncThunk<PatchCategoriesOrderResponse>(
  `${name}/patchCategoriesOrder`,
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const payload = getState().menu.categories.map((c) => ({ id: c.id, position: c.position }));
      const res = await MenuApi.patchCategoriesOrder(payload);
      dispatch(getCategories());
      return res;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

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

export const getSpecialties = createAppAsyncThunk<GetSpecialtyWithSpecialtyItemsResponse>(
  `${name}/getSpecialties`,
  async (_, { rejectWithValue }) => {
    try {
      return await MenuApi.getSpecialties();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

// TODO: delete
export const getSpecialtyById = createAppAsyncThunk<SpecialtyResponse, string>(`${name}/getSpecialtyById`, async (payload, { rejectWithValue }) => {
  try {
    return await MenuApi.getSpecialtyById(payload);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const postSpecialty = createAppAsyncThunk<SpecialtyResponse, ISpecialty>(`${name}/postSpecialty`, async (payload, { rejectWithValue }) => {
  try {
    return await MenuApi.postSpecialty(payload);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchSpecialty = createAppAsyncThunk<SpecialtyResponse, PatchSpecialtyPayload>(
  `${name}/patchSpecialty`,
  async (payload, { rejectWithValue }) => {
    try {
      return await MenuApi.patchSpecialty(payload);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const deleteSpecialty = createAppAsyncThunk<SpecialtyResponse, string>(`${name}/deleteSpecialty`, async (payload, { rejectWithValue }) => {
  try {
    return await MenuApi.deleteSpecialty(payload);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const getSpecialtyItems = createAppAsyncThunk<SpecialtyItemsResponse>(
  `${name}/getSpecialtyItems`,
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      return await MenuApi.getSpecialtyItems();
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
    setCategories: (state, action) => {
      state.needUpdateDb = true;
      state.categories = action.payload;
    },
    setMeals: (state, action) => {
      state.needUpdateDb = true;
      state.meals = action.payload;
    },
    setCreateCategoryModalData: (state, action: PayloadAction<IMenuSliceState['createCategoryModal']['data']>) => {
      state.createCategoryModal.data = action.payload;
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
  setCategories,
  setMeals,
  setCreateCategoryModalData,
  openCreateCategoryModal,
  closeCreateCategoryModal,
  openDeleteCategoryConfirmModal,
  closeDeleteCategoryConfirmModal,
  openSpecialtyItemsSettingModal,
  setSpecialtyItemsSettingModalData,
  closeSpecialtyItemsSettingModal,
} = menuSlice.actions;
