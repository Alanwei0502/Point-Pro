import { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector, useSocket } from '~/hooks';
import { NameSpace } from '~/types';
import { getAvailablePeriods } from '~/store/slices';
import { MobileLayout, MobileHeader } from '~/components';
import { PeopleAndTime } from './PeopleAndTime';
import { BookerInfo } from './BookerInfo';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { BookingSteps } from './BookingSteps';
import { BookingRecordQueryModal } from './BookingRecordQueryModal';
import { BookingReminderModal, ConfirmBookingInfo } from './BookingReminderModal';

interface IBookingProps {}

const stepTitle = ['人數及時間', '訂位人資訊', '請確認輸入資訊'];

export const Booking: FC<IBookingProps> = () => {
  const dispatch = useAppDispatch();

  useSocket({ ns: NameSpace.main });

  const step = useAppSelector(({ customerReservation }) => customerReservation.step);

  useEffect(() => {
    dispatch(getAvailablePeriods());
  }, [dispatch]);

  return (
    <MobileLayout>
      <MobileHeader />
      <Typography variant='h4' fontWeight={900} sx={{ marginBottom: '1rem' }}>
        {stepTitle[step]}
      </Typography>

      <Box component='main'>
        {step === 0 && <PeopleAndTime />}
        {step === 1 && <BookerInfo />}
        {step === 2 && <ConfirmBookingInfo />}
      </Box>

      <BookingSteps stepLength={stepTitle.length} />

      {/* 預訂查詢 */}
      <BookingRecordQueryModal />
      {/* 隱私權政策 */}
      <PrivacyPolicyModal />
      {/* 已為您安排訂位 */}
      <BookingReminderModal />
      {/* 請出示此畫面 QR Code */}
      {/* <BookingQRCodeDialog /> */}
    </MobileLayout>
  );
};
