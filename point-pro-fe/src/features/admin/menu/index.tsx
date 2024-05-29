import { FC } from 'react';
import { Box } from '@mui/material';
import { BaseButton } from '~/components';
import { useAppDispatch } from '~/hooks';
import { openSpecialtySettingModal } from '~/store/slices';
import { MenuSettingTable } from './tables/MenuSettingTable';
import { SpecialtySettingModal } from './modals/SpecialtySettingModal';
import { CreateCategoryModal } from './modals/CreateCategoryModal';
import { DeleteCategoryConfirmModal } from './modals/DeleteCategoryConfirmModal';
import { CreateSpecialtyModal } from './modals/CreateSpecialtyModal';
import { DeleteSpecialtyConfirmModal } from './modals/DeleteSpecialtyConfirmModal';
import { DeleteSpecialtyItemConfirmModal } from './modals/DeleteSpecialtyItemConfirmModal';
import { CreateSpecialtyItemModal } from './modals/CreateSpecialtyItemModal';
import { CreateMealModal } from './modals/CreateMealModal';

interface IAdminMenuSettingsProps {}

export const AdminMenuSettings: FC<IAdminMenuSettingsProps> = () => {
  const dispatch = useAppDispatch();

  const handleOpenSpecialtyItemsSettingModal = () => {
    dispatch(openSpecialtySettingModal());
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, padding: 1 }}>
        <BaseButton variant='contained' onClick={handleOpenSpecialtyItemsSettingModal}>
          客製化設定
        </BaseButton>
      </Box>

      <MenuSettingTable />
      {/* CATEGORY */}
      <CreateCategoryModal />
      <DeleteCategoryConfirmModal />
      {/* MEAL */}
      <CreateMealModal />
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
