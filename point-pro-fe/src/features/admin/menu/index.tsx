import { FC } from 'react';
import { Box } from '@mui/material';
import { BaseButton } from '~/components';
import { useAppDispatch } from '~/hooks';
import { openSpecialtyItemsSettingModal } from '~/store/slices';
import { MenuSettingTable } from './tables/MenuSettingTable';
import { SpecialtySettingModal } from './modals/SpecialtySettingModal';
import { CreateCategoryModal } from './modals/CreateCategoryModal';
import { DeleteCategoryConfirmModal } from './modals/DeleteCategoryConfirmModal';

interface IAdminMenuSettingsProps {}

export const AdminMenuSettings: FC<IAdminMenuSettingsProps> = () => {
  const dispatch = useAppDispatch();

  const handleOpenSpecialtyItemsSettingModal = () => {
    dispatch(openSpecialtyItemsSettingModal());
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, padding: 1 }}>
        <BaseButton variant='contained' onClick={handleOpenSpecialtyItemsSettingModal}>
          客製化設定
        </BaseButton>
      </Box>
      <MenuSettingTable />
      <CreateCategoryModal />
      <DeleteCategoryConfirmModal />
      <SpecialtySettingModal />
    </>
  );
};
