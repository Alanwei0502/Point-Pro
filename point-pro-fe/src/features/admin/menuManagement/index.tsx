import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AppButton, Loading } from '~/components';
import { useAppDispatch } from '~/hooks';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';
import { MenuManagementTable } from './tables/MenuManagementTable';
import { SpecialtySettingModal } from './modals/SpecialtySettingModal';
import { CreateCategoryModal } from './modals/CreateCategoryModal';
import { DeleteCategoryConfirmModal } from './modals/DeleteCategoryConfirmModal';
import { CreateSpecialtyModal } from './modals/CreateSpecialtyModal';
import { DeleteSpecialtyConfirmModal } from './modals/DeleteSpecialtyConfirmModal';
import { DeleteSpecialtyItemConfirmModal } from './modals/DeleteSpecialtyItemConfirmModal';
import { CreateSpecialtyItemModal } from './modals/CreateSpecialtyItemModal';
import { CreateMealModal } from './modals/CreateMealModal';
import { DeleteMealConfirmModal } from './modals/DeleteMealConfirmModal';

const { getCategories, getMeals, getSpecialties, openSpecialtySettingModal } = menuManagementSliceActions;

interface IMenuManagementProps {}

const MenuManagement: FC<IMenuManagementProps> = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenSpecialtyItemsSettingModal = () => {
    dispatch(openSpecialtySettingModal());
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([dispatch(getCategories()).unwrap(), dispatch(getMeals()).unwrap(), dispatch(getSpecialties()).unwrap()]).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, padding: 1 }}>
        <AppButton onClick={handleOpenSpecialtyItemsSettingModal}>客製化設定</AppButton>
      </Box>
      {isLoading && <Loading boxProps={{ position: 'fixed', left: '50%' }} />}

      <MenuManagementTable />
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

export default MenuManagement;
