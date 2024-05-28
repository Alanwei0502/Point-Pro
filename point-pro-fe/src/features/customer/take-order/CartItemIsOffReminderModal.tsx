import { FC } from 'react';
import { Typography } from '@mui/material';
import { MobileModalLayout } from '~/components';
import { useAppSelector } from '~/hooks';
import { MobileModal } from '~/types';

interface ICartItemIsOffReminderModalProps {}

export const CartItemIsOffReminderModal: FC<ICartItemIsOffReminderModalProps> = () => {
  const { type: modalType, data } = useAppSelector(({ takeOrder }) => takeOrder.modal);

  return (
    <MobileModalLayout open={modalType === MobileModal.CART_ITEM_IS_OFF}>
      {data && modalType === MobileModal.CART_ITEM_IS_OFF && (
        <Typography variant='h6' fontWeight={700}>
          「{data.title}」已被下架
        </Typography>
      )}
    </MobileModalLayout>
  );
};
