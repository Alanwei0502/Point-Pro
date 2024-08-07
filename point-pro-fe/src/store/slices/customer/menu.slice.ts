// Libs
import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
// Others
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  ICategory,
  SelectionType,
  MenuCategory,
  MenuMeal,
  MenuSpecialtiesWithItems,
  MenuSpecialtyItem,
  MobileModalState,
  MobileDialogState,
  ICartItem,
  MobileDialog,
} from '~/types';

const sliceName = 'menu';

type menuSliceState = {
  currentCategory: ICategory['id'];
  categories: MenuCategory[];
  meals: MenuMeal[];
  specialtiesWithItems: MenuSpecialtiesWithItems[];
  modal: MobileModalState;
  dialog: MobileDialogState;

  cart: ICartItem[];
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
};

const initialState: menuSliceState = {
  currentCategory: '',
  categories: [],
  meals: [],
  specialtiesWithItems: [],
  cart: [],
  modal: {
    type: '',
    data: undefined,
  },
  dialog: {
    type: '',
    data: undefined,
  },
  modifiedCartItemIndex: 0,
  isModifiedCartItem: false,
  isLoading: false,
};

const getMenu = createAppAsyncThunk(`${sliceName}/getMenu`, async (_, thunkApi) => {
  try {
    const menuRes = await MenuApi.getMenu();
    return menuRes.result;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const menuSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    // Category Tab Focus
    setCurrentCategory: (state, action: PayloadAction<menuSliceState['currentCategory']>) => {
      state.currentCategory = action.payload;
    },
    // Modal
    openModal: (state, action: PayloadAction<MobileModalState>) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = initialState.modal;
    },
    // Dialog
    openDialog: (state, action: PayloadAction<MobileDialogState>) => {
      state.dialog = action.payload;
    },
    closeDialog: (state) => {
      state.dialog = initialState.dialog;
      menuSlice.caseReducers.setNotModifiedCartItem(state);
    },
    updateSpecialty: (
      state,
      action: PayloadAction<{
        selectedSpecialty: MenuSpecialtiesWithItems;
        selectedItem: MenuSpecialtyItem;
      }>,
    ) => {
      if (!state.dialog.data) return;

      const { selectedSpecialty, selectedItem } = action.payload;

      const index = state.dialog.data.selectedSpecialtyItems.findIndex(({ id }) => id === selectedItem.id);
      const isSelected = index !== -1;

      if (isSelected) {
        state.dialog.data.selectedSpecialtyItems.splice(index, 1);
      } else {
        switch (selectedSpecialty.selectionType) {
          case SelectionType.SINGLE: {
            const singleSpecialtyItemIds = selectedSpecialty.specialtyItems.map((item) => item.id);
            const newSelectedSpecialtyItems = state.dialog.data.selectedSpecialtyItems.filter((item) => !singleSpecialtyItemIds.includes(item.id));
            state.dialog.data.selectedSpecialtyItems = [...newSelectedSpecialtyItems, selectedItem];
            break;
          }
          case SelectionType.MULTIPLE: {
            state.dialog.data.selectedSpecialtyItems.push(selectedItem);
            break;
          }
        }
      }
    },
    increaseMealAmount: (state) => {
      if (state.dialog.data) {
        state.dialog.data.amount < 5 && state.dialog.data.amount++;
      }
    },
    decreaseMealAmount: (state) => {
      if (state.dialog.data) {
        state.dialog.data.amount > 1 && state.dialog.data.amount--;
      }
    },
    setNotModifiedCartItem: (state) => {
      state.isModifiedCartItem = initialState.isModifiedCartItem;
      state.modifiedCartItemIndex = initialState.modifiedCartItemIndex;
    },
    createCartItem: (state) => {
      if (state.dialog.data) {
        state.cart.push(state.dialog.data);
        menuSlice.caseReducers.closeDialog(state);
      }
    },
    viewCartItemCustomized: (state, action: PayloadAction<{ cartItem: ICartItem; idx: number }>) => {
      const { cartItem, idx } = action.payload;
      state.dialog = { type: MobileDialog.CUSTOMIZED, data: cartItem };
      state.modifiedCartItemIndex = idx;
      state.isModifiedCartItem = true;
    },
    updateCartItem: (state) => {
      if (state.dialog.data) {
        state.cart.splice(state.modifiedCartItemIndex, 1, state.dialog.data);
        state.dialog = { type: MobileDialog.CART, data: undefined };
      }
    },
    deleteCartItem: (state, action: PayloadAction<number>) => {
      state.cart.splice(action.payload, 1);
    },
    clearCart: (state) => {
      state.cart = initialState.cart;
      menuSlice.caseReducers.closeModal(state);
      menuSlice.caseReducers.closeDialog(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        if (state.currentCategory === initialState.currentCategory) {
          state.currentCategory = action.payload?.categories[0]?.id ?? '';
        }
        state.categories = action.payload?.categories ?? [];
        state.meals = action.payload?.meals ?? [];
        state.specialtiesWithItems = action.payload?.specialtiesWithItems ?? [];
        state.isLoading = false;
      })
      .addCase(getMenu.rejected, (state) => {
        state.categories = initialState.categories;
        state.currentCategory = initialState.currentCategory;
        state.meals = initialState.meals;
        state.isLoading = false;
      });
  },
});

export const menuSliceActions = {
  ...menuSlice.actions,
  getMenu,
};

export default menuSlice;
