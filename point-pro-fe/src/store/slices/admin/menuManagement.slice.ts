import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  ICategory,
  PostCategoryPayload,
  ISpecialty,
  SocketTopic,
  IMealWithCategoryAndSpecialtyItems,
  ISpecialtyWithSpecialtyItems,
  PatchSpecialtyPayload,
  PostSpecialtyPayload,
  PatchCategoryPayload,
  PatchSpecialtyItemOrderPayload,
  PatchSpecialtyItemPayload,
  PostSpecialtyItemPayload,
  PatchCategoryOrderPayload,
  PatchMealOrderPayload,
  PatchSpecialtyOrderPayload,
  DeleteCategoryPayload,
  DeleteMealPaylaod,
  DeleteSpecialtyPayload,
  PostMealPayload,
  PatchMealPayload,
  DeleteSpecialtyItemPayload,
} from '~/types';

const name = 'menuManagement';

interface IMenuManagementSliceState {
  categories: ICategory[];
  meals: IMealWithCategoryAndSpecialtyItems[];
  specialties: ISpecialtyWithSpecialtyItems[];
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
    data: IMealWithCategoryAndSpecialtyItems | null;
  };
  // SPECIALTY
  specialtySettingModal: {
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
  // SPECIALTY ITEM
  deleteSpecialtyItemConfirmModal: {
    isOpen: boolean;
    data: ISpecialtyWithSpecialtyItems['specialtyItems'][0] | null;
  };
  createSpecialtyItemModal: {
    isOpen: boolean;
    data: ISpecialtyWithSpecialtyItems | null;
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
export const getCategories = createAppAsyncThunk(`${name}/getCategories`, async (_, thunkApi) => {
  try {
    return await MenuApi.getCategories();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const postCategory = createAppAsyncThunk(`${name}/postCategory`, async (payload: PostCategoryPayload, thunkApi) => {
  try {
    const newCategory = await MenuApi.postCategory(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, newCategory);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchCategory = createAppAsyncThunk(`${name}/patchCategory`, async (payload: PatchCategoryPayload, thunkApi) => {
  try {
    const updateCategory = await MenuApi.patchCategory(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, updateCategory);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchCategoryOrder = createAppAsyncThunk(`${name}/patchCategoryOrder`, async (payload: PatchCategoryOrderPayload, thunkApi) => {
  try {
    await MenuApi.patchCategoryOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const deleteCategory = createAppAsyncThunk(`${name}/deleteCategory`, async (payload: DeleteCategoryPayload, thunkApi) => {
  try {
    const deleteCategory = await MenuApi.deleteCategory(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, deleteCategory);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// MEAL
export const getMeals = createAppAsyncThunk(`${name}/getMeals`, async (_, thunkApi) => {
  try {
    return await MenuApi.getMeals();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const postMeal = createAppAsyncThunk(`${name}/postMeal`, async (payload: PostMealPayload, thunkApi) => {
  try {
    const newMeal = await MenuApi.postMeal(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, newMeal);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchMeal = createAppAsyncThunk(`${name}/patchMeal`, async (payload: PatchMealPayload, thunkApi) => {
  try {
    const updateMeal = await MenuApi.patchMeal(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, updateMeal);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchMealOrder = createAppAsyncThunk(`${name}/patchMealOrder`, async (payload: PatchMealOrderPayload, thunkApi) => {
  try {
    await MenuApi.patchMealOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const deleteMeal = createAppAsyncThunk(`${name}/deleteMeal`, async (payload: DeleteMealPaylaod, thunkApi) => {
  try {
    const deletedMeal = await MenuApi.deleteMeal(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, deletedMeal);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// SPECIALTY
export const getSpecialties = createAppAsyncThunk(`${name}/getSpecialties`, async (_, thunkApi) => {
  try {
    return await MenuApi.getSpecialties();
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const postSpecialty = createAppAsyncThunk(`${name}/postSpecialty`, async (payload: PostSpecialtyPayload, thunkApi) => {
  try {
    const newSpecialty = await MenuApi.postSpecialty(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, newSpecialty);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchSpecialty = createAppAsyncThunk(`${name}/patchSpecialty`, async (payload: PatchSpecialtyPayload, thunkApi) => {
  try {
    const updateSpecialty = await MenuApi.patchSpecialty(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, updateSpecialty);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchSpecialtyOrder = createAppAsyncThunk(`${name}/patchSpecialtyOrder`, async (payload: PatchSpecialtyOrderPayload, thunkApi) => {
  try {
    await MenuApi.patchSpecialtyOrder(payload);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const deleteSpecialty = createAppAsyncThunk(`${name}/deleteSpecialty`, async (payload: DeleteSpecialtyPayload, thunkApi) => {
  try {
    const deleteSpecialty = await MenuApi.deleteSpecialty(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, deleteSpecialty);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

// SPECIALTY ITEM
export const postSpecialtyItem = createAppAsyncThunk(`${name}/postSpecialtyItem`, async (payload: PostSpecialtyItemPayload, thunkApi) => {
  try {
    const newSpecialtyItem = await MenuApi.postSpecialtyItem(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, newSpecialtyItem);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchSpecialtyItem = createAppAsyncThunk(`${name}/patchSpecialtyItem`, async (payload: PatchSpecialtyItemPayload, thunkApi) => {
  try {
    const updateSpecialtyItem = await MenuApi.patchSpecialtyItem(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, updateSpecialtyItem);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const patchSpecialtyItemOrder = createAppAsyncThunk(
  `${name}/patchSpecialtyItemOrder`,
  async (payload: PatchSpecialtyItemOrderPayload, thunkApi) => {
    try {
      await MenuApi.patchSpecialtyItemOrder(payload);
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  },
);

export const deleteSpecialtyItem = createAppAsyncThunk(`${name}/deleteSpecialtyItem`, async (payload: DeleteSpecialtyItemPayload, thunkApi) => {
  try {
    const deleteSpecialtyItem = await MenuApi.deleteSpecialtyItem(payload);
    const socket = thunkApi.getState().socket.socket;
    socket?.emit(SocketTopic.MENU, deleteSpecialtyItem);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const menuManagementSlice = createSlice({
  name,
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
    openDeleteMealConfirmModal: (state, action: PayloadAction<IMealWithCategoryAndSpecialtyItems>) => {
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
    setSpecialtyItems: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems['specialtyItems']>) => {
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
    setSpecialtySettingModalData: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems[]>) => {
      state.specialtySettingModal.data = action.payload;
    },
    closeSpecialtySettingModal: (state) => {
      state.specialtySettingModal = initialState.specialtySettingModal;
    },
    openCreateSpecialtyItemModal: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems>) => {
      state.createSpecialtyItemModal.isOpen = true;
      state.createSpecialtyItemModal.data = action.payload;
    },
    closeCreateSpecialtyItemModal: (state) => {
      state.createSpecialtyItemModal = initialState.createSpecialtyItemModal;
    },
    openDeleteSpecialtyItemConfirmModal: (state, action: PayloadAction<ISpecialtyWithSpecialtyItems['specialtyItems'][0]>) => {
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

export const {
  // CATEGORY
  setCategories,
  openCreateCategoryModal,
  closeCreateCategoryModal,
  openDeleteCategoryConfirmModal,
  closeDeleteCategoryConfirmModal,
  // MEAL
  setMeals,
  openCreateMealModal,
  closeCreateMealModal,
  openDeleteMealConfirmModal,
  closeDeleteMealConfirmModal,
  // SPECIALTY
  setSpecialties,
  setSpecialtySettingModalData,
  openSpecialtySettingModal,
  closeSpecialtySettingModal,
  openCreateSpecialtyModal,
  closeCreateSpecialtyModal,
  openDeleteSpecialtyConfirmModal,
  closeDeleteSpecialtyConfirmModal,
  // SPECIALTY ITEM
  setSpecialtyItems,
  openCreateSpecialtyItemModal,
  closeCreateSpecialtyItemModal,
  openDeleteSpecialtyItemConfirmModal,
  closeDeleteSpecialtyItemConfirmModal,
} = menuManagementSlice.actions;
