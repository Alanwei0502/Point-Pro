import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  ICategory,
  PostCategoryPayload,
  ISpecialty,
  IMeal,
  SocketTopic,
  PatchMealByIdPayload,
  IMealWithCategoryAndSpecialtyItems,
  ISpecialtyItem,
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
} from '~/types';

const name = 'menu';

interface IMenuSliceState {
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
    data: IMeal | null;
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

const initialState: IMenuSliceState = {
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

export const postCategory = createAppAsyncThunk(`${name}/postCategory`, async (payload: PostCategoryPayload, { rejectWithValue }) => {
  try {
    await MenuApi.postCategory(payload);
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

export const patchCategoriesOrder = createAppAsyncThunk(
  `${name}/patchCategoriesOrder`,
  async (payload: PatchCategoryOrderPayload, { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.patchCategoriesOrder(payload);
      dispatch(getCategories());
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const deleteCategory = createAppAsyncThunk(`${name}/deleteCategory`, async (payload: DeleteCategoryPayload, { rejectWithValue, dispatch }) => {
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

// MEAL
export const getMeals = createAppAsyncThunk(`${name}/getMeals`, async (_, { rejectWithValue }) => {
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

export const getMealById = createAppAsyncThunk(`${name}/getMealById`, async (payload: IMeal['id'], { rejectWithValue }) => {
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

export const postMeal = createAppAsyncThunk(`${name}/postMeal`, async (payload: PostMealPayload, { getState, rejectWithValue }) => {
  try {
    const socket = getState().socket.socket;
    const newMeal = await MenuApi.postMeal(payload);
    socket && socket.emit(SocketTopic.MENU, newMeal);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchMealById = createAppAsyncThunk(
  `${name}/patchMealById`,
  async (payload: PatchMealByIdPayload, { getState, rejectWithValue, dispatch }) => {
    try {
      const socket = getState().socket.socket;
      const updatedMeal = await MenuApi.patchMealById(payload);
      socket && socket.emit(SocketTopic.MENU, updatedMeal);
      dispatch(getMeals);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const patchMealsOrder = createAppAsyncThunk(
  `${name}/patchMealsOrder`,
  async (payload: PatchMealOrderPayload, { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.patchMealsOrder(payload);
      dispatch(getMeals());
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue({ message: error.message });
      } else {
        return rejectWithValue({ message: 'unknown error' });
      }
    }
  },
);

export const deleteMeal = createAppAsyncThunk(`${name}/deleteMeal`, async (payload: DeleteMealPaylaod, { getState, rejectWithValue, dispatch }) => {
  try {
    const socket = getState().socket.socket;
    const deletedMeal = await MenuApi.deleteMeal(payload);
    socket && socket.emit(SocketTopic.MENU, deletedMeal);
    dispatch(getMeals());
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

export const postSpecialty = createAppAsyncThunk(`${name}/postSpecialty`, async (payload: PostSpecialtyPayload, { rejectWithValue }) => {
  try {
    await MenuApi.postSpecialty(payload);
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

export const patchSpecialtiesOrder = createAppAsyncThunk(
  `${name}/patchSpecialtiesOrder`,
  async (payload: PatchSpecialtyOrderPayload, { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.patchSpecialtiesOrder(payload);
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

export const deleteSpecialty = createAppAsyncThunk(
  `${name}/deleteSpecialty`,
  async (payload: DeleteSpecialtyPayload, { rejectWithValue, dispatch }) => {
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
  },
);

// SPECIALTY ITEM
export const postSpecialtyItem = createAppAsyncThunk(`${name}/postSpecialtyItem`, async (payload: PostSpecialtyItemPayload, { rejectWithValue }) => {
  try {
    await MenuApi.postSpecialtyItem(payload);
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const patchSpecialtyItem = createAppAsyncThunk(
  `${name}/patchSpecialtyItem`,
  async (payload: PatchSpecialtyItemPayload, { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.patchSpecialtyItem(payload);
      dispatch(closeCreateSpecialtyItemModal());
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

export const patchSpecialtyItemsOrder = createAppAsyncThunk(
  `${name}/patchSpecialtyItemsOrder`,
  async (payload: PatchSpecialtyItemOrderPayload, { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.patchSpecialtyItemsOrder(payload);
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

export const deleteSpecialtyItem = createAppAsyncThunk(
  `${name}/deleteSpecialtyItem`,
  async (payload: ISpecialtyItem['id'], { rejectWithValue, dispatch }) => {
    try {
      await MenuApi.deleteSpecialtyItem(payload);
      dispatch(closeDeleteSpecialtyItemConfirmModal());
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
    openCreateMealModal: (state) => {
      state.createMealModal.isOpen = true;
    },
    closeCreateMealModal: (state) => {
      state.createMealModal = initialState.createMealModal;
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
} = menuSlice.actions;
