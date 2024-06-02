import { FC } from 'react';
import { Typography } from '@mui/material';
import { MobileModalLayout } from '~/components';
import { useAppSelector } from '~/hooks';
import { MobileModal } from '~/types';

interface ICounterReminderModalProps {}

export const CounterReminderModal: FC<ICounterReminderModalProps> = () => {
  const modalType = useAppSelector((state) => state.menu.modal.type);

  return (
    <MobileModalLayout open={modalType === MobileModal.COUNTER_REMINDER}>
      <Typography variant='h6' fontWeight={700}>
        請至臨櫃結帳
      </Typography>
    </MobileModalLayout>
  );
};
