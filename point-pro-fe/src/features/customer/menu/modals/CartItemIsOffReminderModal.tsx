import { FC } from 'react';
import { Typography } from '@mui/material';
import { useAppSelector } from '~/hooks';
import { MobileModalType } from '~/types';
import { MobileModal } from '~/components';

interface ICartItemIsOffReminderModalProps {}

export const CartItemIsOffReminderModal: FC<ICartItemIsOffReminderModalProps> = () => {
  const { type, data } = useAppSelector((state) => state.menu.modal);

  return (
    <MobileModal open={type === MobileModalType.CART_ITEM_IS_OFF}>
      {data && type === MobileModalType.CART_ITEM_IS_OFF && (
        <Typography variant='h6' fontWeight={700}>
          「{data.title}」已被下架
        </Typography>
      )}
    </MobileModal>
  );
};
