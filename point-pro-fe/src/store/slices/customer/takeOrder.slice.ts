// Libs
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
// Others
import { MenuApi } from '~/api';
import { createAppAsyncThunk } from '~/hooks';
import {
  MobileDialog,
  ICategory,
  SelectionType,
  UserInfo,
  GetMenuResponseCategory,
  GetMenuResponseMeal,
  GetMenuResponseSpecialtiesWithItems,
  GetMenuResponseSpecialtyItem,
  ICartItem,
  MobileModalState,
  MobileDialogState,
} from '~/types';

const name = 'takeOrder';

type TakeOrderSliceState = {
  userInfo: UserInfo | null;
  currentCategory: ICategory['id'];
  categories: GetMenuResponseCategory[];
  meals: GetMenuResponseMeal[];
  specialtiesWithItems: GetMenuResponseSpecialtiesWithItems[];
  modal: MobileModalState;
  dialog: MobileDialogState;

  cart: ICartItem[];
  modifiedCartItemIndex: number;
  isModifiedCartItem: boolean;
  isLoading: boolean;
};

const initialState: TakeOrderSliceState = {
  userInfo: null,
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

export const getMenu = createAppAsyncThunk(`${name}/getMenu`, async (_, { rejectWithValue }) => {
  try {
    const menuRes = await MenuApi.getMenu();
    return menuRes.result;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue({ message: error.message });
    } else {
      return rejectWithValue({ message: 'unknown error' });
    }
  }
});

export const takeOrderSlice = createSlice({
  name,
  initialState,
  reducers: {
    // Category Tab Focus
    setCurrentCategory: (state, action: PayloadAction<TakeOrderSliceState['currentCategory']>) => {
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
      takeOrderSlice.caseReducers.setNotModifiedCartItem(state);
    },
    updateSpecialty: (
      state,
      action: PayloadAction<{
        selectedSpecialty: GetMenuResponseSpecialtiesWithItems;
        selectedItem: GetMenuResponseSpecialtyItem;
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
            const newSelectedSpecialtyItems = state.dialog.data.selectedSpecialtyItems.filter(
              (item) => !singleSpecialtyItemIds.includes(item.id),
            );
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
        takeOrderSlice.caseReducers.closeDialog(state);
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
      takeOrderSlice.caseReducers.closeModal(state);
      takeOrderSlice.caseReducers.closeDialog(state);
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

export const {
  openDialog,
  closeDialog,
  openModal,
  closeModal,
  setCurrentCategory,
  updateSpecialty,
  increaseMealAmount,
  decreaseMealAmount,
  setNotModifiedCartItem,
  viewCartItemCustomized,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
} = takeOrderSlice.actions;
