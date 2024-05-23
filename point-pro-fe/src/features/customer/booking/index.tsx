import { FC, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector, useSocket } from '~/hooks';
import { NameSpace } from '~/types';
import { MobileLayout, MobileHeader } from '~/components';
import { BookingSteps } from './BookingSteps';
import { PeopleAndTime } from './PeopleAndTime';
import { BookerInfo } from './BookerInfo';
import { ConfirmBookingInfo } from './ConfirmBookingInfo';
import { PrivacyPolicyDialog } from './PrivacyPolicyDialog';
import { BookingRecordQueryDialog } from './BookingRecordQueryDialog';
import { BookingReminderDialog } from './BookingReminderDialog';
import { BookingQRCodeDialog } from './BookingQrCodeDialog';

const stepTitle = ['訂位時間', '訂位資訊', '請確認訂位資訊'];

interface IBookingProps {}

export const Booking: FC<IBookingProps> = () => {
  useSocket({ ns: NameSpace.main });

  const step = useAppSelector(({ booking }) => booking.step);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <MobileLayout>
      <MobileHeader />
      <Typography variant='h4' fontWeight={900} sx={{ marginBottom: '1rem' }}>
        {stepTitle[step]}
      </Typography>

      <Box component='main' sx={{ overflowY: 'scroll' }}>
        {step === 0 && <PeopleAndTime />}
        {step === 1 && <BookerInfo />}
        {step === 2 && <ConfirmBookingInfo />}
      </Box>

      <BookingSteps stepLength={stepTitle.length} />

      {/* 預訂查詢 */}
      <BookingRecordQueryDialog />
      {/* 隱私權政策 */}
      <PrivacyPolicyDialog />
      {/* 已為您安排訂位 */}
      <BookingReminderDialog />
      {/* TODO: 請出示此畫面 QR Code */}
      {/* <BookingQRCodeDialog /> */}
    </MobileLayout>
  );
};
