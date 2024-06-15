import { FC } from 'react';
import { Typography } from '@mui/material';
import { AppButton, MobileModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeModal, deleteCartItem } from '~/store/slices';
import { MobileModalType } from '~/types';

interface IRemoveCartItemConfirmModalProps {}

export const RemoveCartItemConfirmModal: FC<IRemoveCartItemConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { type: modalType, data } = useAppSelector((state) => state.menu.modal);

  const handleConfirm = () => {
    if (data && modalType === MobileModalType.REMOVE_CART_CONFIRM) {
      dispatch(deleteCartItem(data.idx));
      dispatch(closeModal());
    }
  };

  return (
    <MobileModal open={modalType === MobileModalType.REMOVE_CART_CONFIRM}>
      <Typography variant='h6' fontWeight={900}>
        從購物車中移除？
      </Typography>
      <AppButton fullWidth onClick={handleConfirm}>
        確定
      </AppButton>
    </MobileModal>
  );
};
