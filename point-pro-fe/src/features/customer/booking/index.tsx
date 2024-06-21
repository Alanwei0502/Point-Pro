import { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { MobileLayout, MobileHeader, Loading } from '~/components';
import { newSocketSliceActions } from '~/store/slices';
import { BookingSteps } from './BookingSteps';
import { PeopleAndTime } from './PeopleAndTime';
import { BookerInfo } from './BookerInfo';
import { ConfirmBookingInfo } from './ConfirmBookingInfo';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import { BookingReminderDialog } from './BookingReminderDialog';
import { SocketRoom } from '~/types';

const stepTitle = ['訂位時間', '訂位資訊', '請確認訂位資訊'];

interface IBookingProps {}

const Booking: FC<IBookingProps> = () => {
  const dispatch = useAppDispatch();

  const step = useAppSelector(({ booking }) => booking.step);
  const isLoading = useAppSelector(({ booking }) => booking.isLoading);

  useEffect(() => {
    const { initSocket, joinRoom } = newSocketSliceActions;
    dispatch(initSocket());
    dispatch(joinRoom(SocketRoom.BOOKING));
  }, [dispatch]);

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

export default Booking;
