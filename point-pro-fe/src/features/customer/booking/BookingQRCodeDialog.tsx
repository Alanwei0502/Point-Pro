import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setDialog } from '~/store/slices';
import { MobileBookingDialog } from '~/types';
import { MobileDialogLayout } from '~/components';

interface IBookingQRCodeDialogProps {}

export const BookingQRCodeDialog: FC<IBookingQRCodeDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ booking }) => booking.dialog);
  const token = useAppSelector(({ auth }) => auth.userToken);

  const checkInQRCode = (import.meta.env.DEV ? 'http://' : 'https://') + window.location.host + '/orders?token=' + token ?? '';

  const handleClose = () => {
    dispatch(setDialog());
  };

  return (
    <MobileDialogLayout
      title='客人桌邊點餐 QR Code'
      titleSize='h2'
      isOpen={dialog === MobileBookingDialog.QRCODE}
      onCloseDialog={handleClose}
      actionButton={<Button onClick={handleClose}>關閉</Button>}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          m: 'auto',
        }}
      >
        <QRCodeSVG size={300} value={checkInQRCode}></QRCodeSVG>
      </Box>
    </MobileDialogLayout>
  );
};
