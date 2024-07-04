import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  ICategory,
  PostCategoryPayload,
  ISpecialty,
  MealWithCategoryAndSpecialtyItems,
  SpecialtyWithSpecialtyItems,
  PatchSpecialtyPayload,
  PostSpecialtyPayload,
  PatchCategoryPayload,
  PatchSpecialtyItemOrderPayload,
  PatchSpecialtyItemPayload,
  PostSpecialtyItemPayload,
  PatchCategoryOrderPayload,
  PatchMealSortingPayload,
  PatchSpecialtyOrderPayload,
  DeleteCategoryPayload,
  DeleteMealPaylaod,
  DeleteSpecialtyPayload,
  PostMealPayload,
  PatchMealPayload,
  DeleteSpecialtyItemPayload,
} from '~/types';

const sliceName = 'menuManagement';

interface IMenuManagementSliceState {
  categories: ICategory[];
  meals: MealWithCategoryAndSpecialtyItems[];
  specialties: SpecialtyWithSpecialtyItems[];
  // CATEGORY
  createCategoryModal: {
    isOpen: boolean;
  };
  deleteCategoryConfirmModal: {
    isOpen: boolean;
    data: ICategory | null;
  };
  // MEAL
  createMealModal: {
    isOpen: boolean;
    data: ICategory['id'] | null;
  };
  deleteMealConfirmModal: {
    isOpen: boolean;
    data: MealWithCategoryAndSpecialtyItems | null;
  };
  // SPECIALTY
  specialtySettingModal: {
    isOpen: boolean;
    data: SpecialtyWithSpecialtyItems[] | null;
  };
  createSpecialtyModal: {
    isOpen: boolean;
  };
  deleteSpecialtyConfirmModal: {
    isOpen: boolean;
    data: ISpecialty | null;
  };
  // SPECIALTY ITEM
  deleteSpecialtyItemConfirmModal: {
    isOpen: boolean;
    data: SpecialtyWithSpecialtyItems['specialtyItems'][0] | null;
  };
  createSpecialtyItemModal: {
    isOpen: boolean;
    data: SpecialtyWithSpecialtyItems | null;
  };
}

const initialState: IMenuManagementSliceState = {
  categories: [],
  meals: [],
  specialties: [],
  // CATEGORY
  createCategoryModal: {
    isOpen: false,
  },
  deleteCategoryConfirmModal: {
    isOpen: false,
    data: null,
  },
  // MEAL
  createMealModal: {
    isOpen: false,
    data: null,
  },
  deleteMealConfirmModal: {
    isOpen: false,
    data: null,
  },
  // SPECIALTY
  specialtySettingModal: {
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
  // SPECIALTY ITEM
  deleteSpecialtyItemConfirmModal: {
    isOpen: false,
    data: null,
  },
  createSpecialtyItemModal: {
    isOpen: false,
    data: null,
  },
};

// CATEGORY
const getCategories = createAppAsyncThunk(`${sliceName}/getCategories`, async (_, thunkApi) => {
  try {
    return await MenuApi.getCategories();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postCategory = createAppAsyncThunk(`${sliceName}/postCategory`, async (payload: PostCategoryPayload, thunkApi) => {
  try {
    await MenuApi.postCategory(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchCategory = createAppAsyncThunk(`${sliceName}/patchCategory`, async (payload: PatchCategoryPayload, thunkApi) => {
  try {
    await MenuApi.patchCategory(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchCategoryOrder = createAppAsyncThunk(`${sliceName}/patchCategoryOrder`, async (payload: PatchCategoryOrderPayload, thunkApi) => {
  try {
    await MenuApi.patchCategoryOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const deleteCategory = createAppAsyncThunk(`${sliceName}/deleteCategory`, async (payload: DeleteCategoryPayload, thunkApi) => {
  try {
    await MenuApi.deleteCategory(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// MEAL
const getMeals = createAppAsyncThunk(`${sliceName}/getMeals`, async (_, thunkApi) => {
  try {
    return await MenuApi.getMeals();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postMeal = createAppAsyncThunk(`${sliceName}/postMeal`, async (payload: PostMealPayload, thunkApi) => {
  try {
    await MenuApi.postMeal(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchMeal = createAppAsyncThunk(`${sliceName}/patchMeal`, async (payload: PatchMealPayload, thunkApi) => {
  try {
    await MenuApi.patchMeal(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchMealOrder = createAppAsyncThunk(`${sliceName}/patchMealOrder`, async (payload: PatchMealSortingPayload, thunkApi) => {
  try {
    await MenuApi.patchMealOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const deleteMeal = createAppAsyncThunk(`${sliceName}/deleteMeal`, async (payload: DeleteMealPaylaod, thunkApi) => {
  try {
    await MenuApi.deleteMeal(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// SPECIALTY
const getSpecialties = createAppAsyncThunk(`${sliceName}/getSpecialties`, async (_, thunkApi) => {
  try {
    return await MenuApi.getSpecialties();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const postSpecialty = createAppAsyncThunk(`${sliceName}/postSpecialty`, async (payload: PostSpecialtyPayload, thunkApi) => {
  try {
    await MenuApi.postSpecialty(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchSpecialty = createAppAsyncThunk(`${sliceName}/patchSpecialty`, async (payload: PatchSpecialtyPayload, thunkApi) => {
  try {
    await MenuApi.patchSpecialty(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchSpecialtyOrder = createAppAsyncThunk(`${sliceName}/patchSpecialtyOrder`, async (payload: PatchSpecialtyOrderPayload, thunkApi) => {
  try {
    await MenuApi.patchSpecialtyOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const deleteSpecialty = createAppAsyncThunk(`${sliceName}/deleteSpecialty`, async (payload: DeleteSpecialtyPayload, thunkApi) => {
  try {
    await MenuApi.deleteSpecialty(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// SPECIALTY ITEM
const postSpecialtyItem = createAppAsyncThunk(`${sliceName}/postSpecialtyItem`, async (payload: PostSpecialtyItemPayload, thunkApi) => {
  try {
    await MenuApi.postSpecialtyItem(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchSpecialtyItem = createAppAsyncThunk(`${sliceName}/patchSpecialtyItem`, async (payload: PatchSpecialtyItemPayload, thunkApi) => {
  try {
    await MenuApi.patchSpecialtyItem(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const patchSpecialtyItemOrder = createAppAsyncThunk(
  `${sliceName}/patchSpecialtyItemOrder`,
  async (payload: PatchSpecialtyItemOrderPayload, thunkApi) => {
    try {
      await MenuApi.patchSpecialtyItemOrder(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

const deleteSpecialtyItem = createAppAsyncThunk(`${sliceName}/deleteSpecialtyItem`, async (payload: DeleteSpecialtyItemPayload, thunkApi) => {
  try {
    await MenuApi.deleteSpecialtyItem(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const menuManagementSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // CATEGORY
    setCategories: (state, action: PayloadAction<IMenuManagementSliceState['categories']>) => {
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
    setMeals: (state, action: PayloadAction<IMenuManagementSliceState['meals']>) => {
      state.meals = action.payload;
    },
    openCreateMealModal: (state, action: PayloadAction<ICategory['id']>) => {
      state.createMealModal.isOpen = true;
      state.createMealModal.data = action.payload;
    },
    closeCreateMealModal: (state) => {
      state.createMealModal = initialState.createMealModal;
    },
    openDeleteMealConfirmModal: (state, action: PayloadAction<MealWithCategoryAndSpecialtyItems>) => {
      state.deleteMealConfirmModal.isOpen = true;
      state.deleteMealConfirmModal.data = action.payload;
    },
    closeDeleteMealConfirmModal: (state) => {
      state.deleteMealConfirmModal = initialState.deleteMealConfirmModal;
    },
    // SPECIALTY
    setSpecialties: (state, action: PayloadAction<IMenuManagementSliceState['specialties']>) => {
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
    setSpecialtyItems: (state, action: PayloadAction<SpecialtyWithSpecialtyItems['specialtyItems']>) => {
      state.specialties = state.specialties.map((s) => {
        if (s.id === action.payload[0].specialtyId) {
          s.specialtyItems = action.payload;
        }
        return s;
      });
    },
    openSpecialtySettingModal: (state) => {
      state.specialtySettingModal.isOpen = true;
      state.specialtySettingModal.data = state.specialties;
    },
    setSpecialtySettingModalData: (state, action: PayloadAction<SpecialtyWithSpecialtyItems[]>) => {
      state.specialtySettingModal.data = action.payload;
    },
    closeSpecialtySettingModal: (state) => {
      state.specialtySettingModal = initialState.specialtySettingModal;
    },
    openCreateSpecialtyItemModal: (state, action: PayloadAction<SpecialtyWithSpecialtyItems>) => {
      state.createSpecialtyItemModal.isOpen = true;
      state.createSpecialtyItemModal.data = action.payload;
    },
    closeCreateSpecialtyItemModal: (state) => {
      state.createSpecialtyItemModal = initialState.createSpecialtyItemModal;
    },
    openDeleteSpecialtyItemConfirmModal: (state, action: PayloadAction<SpecialtyWithSpecialtyItems['specialtyItems'][0]>) => {
      state.deleteSpecialtyItemConfirmModal.isOpen = true;
      state.deleteSpecialtyItemConfirmModal.data = action.payload;
    },
    closeDeleteSpecialtyItemConfirmModal: (state) => {
      state.deleteSpecialtyItemConfirmModal = initialState.deleteSpecialtyItemConfirmModal;
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

export const menuManagementSliceActions = {
  ...menuManagementSlice.actions,
  // CATEGORY
  getCategories,
  postCategory,
  patchCategory,
  patchCategoryOrder,
  deleteCategory,
  // MEAL
  getMeals,
  postMeal,
  patchMeal,
  patchMealOrder,
  deleteMeal,
  // SPECIALTY
  getSpecialties,
  postSpecialty,
  patchSpecialty,
  patchSpecialtyOrder,
  deleteSpecialty,
  // SPECIALTY ITEM
  postSpecialtyItem,
  patchSpecialtyItem,
  patchSpecialtyItemOrder,
  deleteSpecialtyItem,
};

export default menuManagementSlice;
