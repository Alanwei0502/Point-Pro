import { FC } from 'react';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';
import { SpecialtySettingTable } from '../tables/SpecialtySettingTable';

const { closeSpecialtySettingModal } = menuManagementSliceActions;

interface ISpecialtyItemsSettingModalProps {}

export const SpecialtySettingModal: FC<ISpecialtyItemsSettingModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.menuManagement.specialtySettingModal.isOpen);

  const handleCloseModal = () => {
    dispatch(closeSpecialtySettingModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '客製化設定',
      }}
      cardContentProps={{
        sx: { padding: 0, minWidth: '60cqw', maxHeight: 600, overflow: 'scroll' },
        children: <SpecialtySettingTable />,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton fullWidth onClick={handleCloseModal}>
              關閉
            </AppButton>
          </>
        ),
      }}
    />
  );
};
