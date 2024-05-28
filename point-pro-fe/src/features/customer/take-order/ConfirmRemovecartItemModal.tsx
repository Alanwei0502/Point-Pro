import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import { MobileModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeModal, deleteCartItem } from '~/store/slices/customer/takeOrder.slice';
import { MobileModal } from '~/types';

interface IConfirmRemoveCartItemModalProps {}

export const ConfirmRemoveCartItemModal: FC<IConfirmRemoveCartItemModalProps> = () => {
  const dispatch = useAppDispatch();

  const { type: modalType, data } = useAppSelector(({ takeOrder }) => takeOrder.modal);

  const handleConfirm = () => {
    if (data && modalType === MobileModal.REMOVE_CART_CONFIRM) {
      dispatch(deleteCartItem(data.idx));
      dispatch(closeModal());
    }
  };

  return (
    <MobileModalLayout open={modalType === MobileModal.REMOVE_CART_CONFIRM}>
      <>
        <Typography variant='h6' fontWeight={900}>
          從購物車中移除？
        </Typography>
        <Button
          onClick={handleConfirm}
          sx={{
            color: 'common.black',
            bgcolor: 'primary.main',
            width: '100%',
          }}
        >
          確定
        </Button>
      </>
    </MobileModalLayout>
  );
};
