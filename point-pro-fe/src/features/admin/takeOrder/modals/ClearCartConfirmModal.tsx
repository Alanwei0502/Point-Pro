import { FC } from 'react';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { takeOrderSliceActions } from '~/store/slices';

interface IClearCartConfirmModalProps {}

export const ClearCartConfirmModal: FC<IClearCartConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.takeOrder.clearCartConfirmModal.isOpen);

  const handleClearCart = () => {
    dispatch(takeOrderSliceActions.clearCart());
    dispatch(takeOrderSliceActions.closeClearCartConfirmModal());
  };

  const handleCancel = () => {
    dispatch(takeOrderSliceActions.closeClearCartConfirmModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '清空所有已點項目',
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>確定要刪除目前已點的所有項目？</Typography>,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleClearCart}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
