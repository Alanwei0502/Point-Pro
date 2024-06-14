import { FC } from 'react';
import { Typography } from '@mui/material';
import { MobileModal } from '~/components';
import { useAppSelector } from '~/hooks';
import { MobileModalType } from '~/types';

interface ICartItemIsOffReminderModalProps {}

export const CartItemIsOffReminderModal: FC<ICartItemIsOffReminderModalProps> = () => {
  const { type: modalType, data } = useAppSelector((state) => state.menu.modal);

  return (
    <MobileModal open={modalType === MobileModalType.CART_ITEM_IS_OFF}>
      {data && modalType === MobileModalType.CART_ITEM_IS_OFF && (
        <Typography variant='h6' fontWeight={700}>
          「{data.title}」已被下架
        </Typography>
      )}
    </MobileModal>
  );
};
