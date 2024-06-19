import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { AppButton, MobileModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeModal, deleteCartItem } from '~/store/slices';
import { MobileModalType } from '~/types';

interface IRemoveCartItemConfirmModalProps {}

export const RemoveCartItemConfirmModal: FC<IRemoveCartItemConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { type: modalType, data } = useAppSelector((state) => state.menu.modal);

  if (!data) return null;
  if (modalType !== MobileModalType.REMOVE_CART_CONFIRM) return null;

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    dispatch(deleteCartItem(data.idx));
    dispatch(closeModal());
  };

  return (
    <MobileModal open={modalType === MobileModalType.REMOVE_CART_CONFIRM}>
      <Typography fontWeight={700}>確定移除「{data.cartItem.title}」？</Typography>
      <Box display='flex' width='100%' gap={1}>
        <AppButton fullWidth onClick={handleCancel}>
          否
        </AppButton>
        <AppButton fullWidth onClick={handleConfirm}>
          是
        </AppButton>
      </Box>
    </MobileModal>
  );
};
