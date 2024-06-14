import { FC } from 'react';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeSpecialtySettingModal } from '~/store/slices';
import { SpecialtySettingTable } from '../tables/SpecialtySettingTable';

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
        sx: { padding: 0, minWidth: '60cqw', maxHeight: 500, overflow: 'scroll' },
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
