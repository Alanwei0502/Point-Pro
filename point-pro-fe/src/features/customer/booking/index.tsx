import { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector, useSocket } from '~/hooks';
import { NameSpace } from '~/types';
import { MobileLayout, MobileHeader, Loading } from '~/components';
import { BookingSteps } from './BookingSteps';
import { PeopleAndTime } from './PeopleAndTime';
import { BookerInfo } from './BookerInfo';
import { ConfirmBookingInfo } from './ConfirmBookingInfo';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import { BookingReminderDialog } from './BookingReminderDialog';

const stepTitle = ['訂位時間', '訂位資訊', '請確認訂位資訊'];

interface IBookingProps {}

export const Booking: FC<IBookingProps> = () => {
  useSocket({ ns: NameSpace.main });

  const step = useAppSelector(({ booking }) => booking.step);
  const isLoading = useAppSelector(({ booking }) => booking.isLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <MobileLayout>
      <Loading open={isLoading} />
      <MobileHeader />
      <Typography variant='h6' fontWeight={700}>
        {stepTitle[step]}
      </Typography>

      <Box component='main' sx={{ overflowY: 'scroll' }}>
        {step === 0 && <PeopleAndTime />}
        {step === 1 && <BookerInfo />}
        {step === 2 && <ConfirmBookingInfo />}
      </Box>

      <BookingSteps stepLength={stepTitle.length} />

      {/* 隱私權政策 */}
      <PrivacyPolicyDialog />
      {/* 已為您安排訂位 */}
      <BookingReminderDialog />
    </MobileLayout>
  );
};
