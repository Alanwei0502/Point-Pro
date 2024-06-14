import { FC } from 'react';
import { Typography } from '@mui/material';
import { MobileModal } from '~/components';
import { useAppSelector } from '~/hooks';
import { MobileModalType } from '~/types';

interface ICounterReminderModalProps {}

export const CounterReminderModal: FC<ICounterReminderModalProps> = () => {
  const modalType = useAppSelector((state) => state.menu.modal.type);

  return (
    <MobileModal open={modalType === MobileModalType.COUNTER_REMINDER}>
      <Typography variant='h6' fontWeight={700}>
        請至臨櫃結帳
      </Typography>
    </MobileModal>
  );
};
