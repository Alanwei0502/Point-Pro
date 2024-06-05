import { FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { AppButton } from '~/components';
import { useAppDispatch } from '~/hooks';
import { getCategories, getMeals, getSpecialties, openSpecialtySettingModal } from '~/store/slices';
import { MenuSettingTable } from './tables/MenuSettingTable';
import { SpecialtySettingModal } from './modals/SpecialtySettingModal';
import { CreateCategoryModal } from './modals/CreateCategoryModal';
import { DeleteCategoryConfirmModal } from './modals/DeleteCategoryConfirmModal';
import { CreateSpecialtyModal } from './modals/CreateSpecialtyModal';
import { DeleteSpecialtyConfirmModal } from './modals/DeleteSpecialtyConfirmModal';
import { DeleteSpecialtyItemConfirmModal } from './modals/DeleteSpecialtyItemConfirmModal';
import { CreateSpecialtyItemModal } from './modals/CreateSpecialtyItemModal';
import { CreateMealModal } from './modals/CreateMealModal';
import { DeleteMealConfirmModal } from './modals/DeleteMealConfirmModal';

interface IAdminMenuSettingsProps {}

export const AdminMenuSettings: FC<IAdminMenuSettingsProps> = () => {
  const dispatch = useAppDispatch();

  const handleOpenSpecialtyItemsSettingModal = () => {
    dispatch(openSpecialtySettingModal());
  };

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getMeals());
    dispatch(getSpecialties());
  }, [dispatch]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, padding: 1 }}>
        <AppButton onClick={handleOpenSpecialtyItemsSettingModal}>客製化設定</AppButton>
      </Box>

      <MenuSettingTable />
      {/* CATEGORY */}
      <CreateCategoryModal />
      <DeleteCategoryConfirmModal />
      {/* MEAL */}
      <CreateMealModal />
      <DeleteMealConfirmModal />
      {/* SPECIALTY */}
      <SpecialtySettingModal />
      <CreateSpecialtyModal />
      <DeleteSpecialtyConfirmModal />
      {/* SPECIALTY ITEM */}
      <CreateSpecialtyItemModal />
      <DeleteSpecialtyItemConfirmModal />
    </>
  );
};
