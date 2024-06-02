import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import { errorHandler } from '~/store/errorHandler';
import {
  GetMenuResponseCategory,
  GetMenuResponseMeal,
  GetMenuResponseSpecialtiesWithItems,
  GetMenuResponseSpecialtyItem,
  ICategory,
  ISpecialty,
  SelectionType,
} from '~/types';

const name = 'takeOrder';

export interface ITakeOrderSliceState {
  selectCategory: ICategory['id'];
  selectMeal: (GetMenuResponseMeal & { amount: number }) | null;
  selectSpecialtyItems: (GetMenuResponseSpecialtyItem & { specialtyId: ISpecialty['id'] })[];
  categories: GetMenuResponseCategory[];
  meals: GetMenuResponseMeal[];
  specialtiesWithItems: GetMenuResponseSpecialtiesWithItems[];
  editingCartItem: number;
  cart: (ITakeOrderSliceState['selectMeal'] & { selectSpecialtyItems: ITakeOrderSliceState['selectSpecialtyItems'] })[];
  clearCartConfirmModal: {
    isOpen: boolean;
  };
  submitCartConfirmModal: {
    isOpen: boolean;
  };
}

const initialState: ITakeOrderSliceState = {
  selectCategory: '',
  selectMeal: null,
  selectSpecialtyItems: [],
  categories: [],
  meals: [],
  specialtiesWithItems: [],
  editingCartItem: -1,
  cart: [],
  clearCartConfirmModal: {
    isOpen: false,
  },
  submitCartConfirmModal: {
    isOpen: false,
  },
};

export const getAdminMenu = createAppAsyncThunk(`${name}/getAdminMenu`, async (_, { rejectWithValue }) => {
  try {
    const menuRes = await MenuApi.getMenu();
    return menuRes.result;
  } catch (error) {
    errorHandler(error);
    return rejectWithValue(error);
  }
});

export const takeOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    // Category Tab Focus
    setSelectCategory: (state, action: PayloadAction<ITakeOrderSliceState['selectCategory']>) => {
      state.selectCategory = action.payload;
    },
    setUnselectMeal: (state) => {
      state.selectMeal = initialState.selectMeal;
      state.selectSpecialtyItems = initialState.selectSpecialtyItems;
    },
    setSelectMeal: (state, action: PayloadAction<ITakeOrderSliceState['selectMeal']>) => {
      state.selectMeal = action.payload;
      state.selectSpecialtyItems = initialState.selectSpecialtyItems;
    },
    setNotModifiedCartItem: (state) => {
      state.editingCartItem = initialState.editingCartItem;
      // state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
    },
    increaseMealAmount: (state) => {
      if (state.selectMeal) {
        state.selectMeal.amount < 5 && state.selectMeal.amount++;
      }
    },
    decreaseMealAmount: (state) => {
      if (state.selectMeal) {
        state.selectMeal.amount > 1 && state.selectMeal.amount--;
      }
    },
    setSelectSpecialtyItems: (
      state,
      action: PayloadAction<{
        selectedSpecialtyId: ISpecialty['id'];
        selectionType: SelectionType;
        selectedItem: ITakeOrderSliceState['selectSpecialtyItems'][0];
      }>,
    ) => {
      const { selectedSpecialtyId, selectionType, selectedItem } = action.payload;
      const isSelected = state.selectSpecialtyItems.some((i) => i.id === selectedItem.id);

      if (isSelected) {
        state.selectSpecialtyItems = state.selectSpecialtyItems.filter((i) => i.id !== selectedItem.id);
        return;
      } else {
        if (selectionType === SelectionType.SINGLE) {
          const newSelectedSpecialtyItems = state.selectSpecialtyItems.filter((ssi) => ssi.specialtyId !== selectedSpecialtyId).concat(selectedItem);

          state.selectSpecialtyItems = newSelectedSpecialtyItems;
        }

        if (selectionType === SelectionType.MULTIPLE) {
          state.selectSpecialtyItems.push(selectedItem);
        }
      }
    },
    addCartItem: (state) => {
      if (state.selectMeal) {
        state.cart.push({
          ...state.selectMeal,
          selectSpecialtyItems: state.selectSpecialtyItems,
        });
        state.selectMeal = initialState.selectMeal;
        state.selectSpecialtyItems = initialState.selectSpecialtyItems;
      }
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter((_, i) => i !== action.payload);
    },
    editCartItem: (state, action: PayloadAction<number>) => {
      const selectCartItem = state.cart[action.payload];
      const { selectSpecialtyItems, ...rest } = selectCartItem;
      state.selectMeal = rest;
      state.selectSpecialtyItems = selectSpecialtyItems;
      state.editingCartItem = action.payload;
    },
    updateCartItem: (state) => {
      if (state.selectMeal && state.editingCartItem !== -1) {
        state.cart = state.cart.map((m, i) => {
          if (i === state.editingCartItem) {
            return {
              ...m,
              ...state.selectMeal,
              selectSpecialtyItems: state.selectSpecialtyItems,
            };
          }
          return m;
        });
        state.selectMeal = initialState.selectMeal;
        state.selectSpecialtyItems = initialState.selectSpecialtyItems;
        state.editingCartItem = initialState.editingCartItem;
      }
    },
    openClearCartConfirmModal: (state) => {
      state.clearCartConfirmModal.isOpen = true;
    },
    closeClearCartConfirmModal: (state) => {
      state.clearCartConfirmModal = initialState.clearCartConfirmModal;
    },
    openSubmitCartConfirmModal: (state) => {
      state.submitCartConfirmModal.isOpen = true;
    },
    closeSubmitCartConfirmModal: (state) => {
      state.submitCartConfirmModal = initialState.submitCartConfirmModal;
    },

    resetTakeOrderState: (state) => {
      state.selectMeal = initialState.selectMeal;
      state.selectSpecialtyItems = initialState.selectSpecialtyItems;
      state.clearCartConfirmModal = initialState.clearCartConfirmModal;
      state.editingCartItem = initialState.editingCartItem;
      state.submitCartConfirmModal = initialState.submitCartConfirmModal;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminMenu.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(getAdminMenu.fulfilled, (state, action) => {
        if (state.selectCategory === initialState.selectCategory) {
          state.selectCategory = action.payload?.categories[0]?.id ?? '';
        }
        state.categories = action.payload?.categories ?? [];
        state.meals = action.payload?.meals ?? [];
        state.specialtiesWithItems = action.payload?.specialtiesWithItems ?? [];
        // state.isLoading = false;
      })
      .addCase(getAdminMenu.rejected, (state) => {
        state.categories = initialState.categories;
        state.selectCategory = initialState.selectCategory;
        state.meals = initialState.meals;
        // state.isLoading = false;
      });
  },
});
