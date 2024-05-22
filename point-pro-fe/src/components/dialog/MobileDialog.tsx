import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setDialog } from '~/store/slices';
import { CustomerBookingDialog } from '~/types';

interface IMobileDialogLayoutProps {
  title?: React.ReactNode;
  titleSize?: Variant;
  isShowCloseIcon?: boolean;
  children?: React.ReactNode;
  isOpen: boolean;
  onCloseDialog: () => void;
  actionButton?: React.ReactNode;
  dialogProps?: DialogProps;
  dialogTitleProps?: DialogTitleProps;
  dialogContentProps?: DialogContentProps;
  dialogActionProps?: DialogActionsProps;
}

export const MobileDialogLayout: FC<IMobileDialogLayoutProps> = (props) => {
  const {
    title = '',
    titleSize = 'h4',
    isShowCloseIcon = true,
    children = null,
    isOpen,
    onCloseDialog,
    actionButton,
    dialogProps,
    dialogTitleProps,
    dialogContentProps,
    dialogActionProps,
  } = props;

  return (
    <Dialog
      {...dialogProps}
      fullScreen
      onClose={onCloseDialog}
      open={isOpen}
      sx={{ bgcolor: '#E1E1E1', width: '100vw', maxWidth: '768px', margin: '0 auto', userSelect: 'none' }}
    >
      <DialogTitle {...dialogTitleProps}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant={titleSize} fontWeight={900} sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {isShowCloseIcon && <CancelIcon sx={{ fontSize: '2.5rem', cursor: 'pointer' }} onClick={onCloseDialog} />}
        </Box>
      </DialogTitle>

      <DialogContent {...dialogContentProps}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      </DialogContent>

      {actionButton && (
        <DialogActions
          {...dialogActionProps}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            bgcolor: 'common.white',
            '.MuiButtonBase-root': {
              width: '100%',
              margin: 0,
              bgcolor: 'primary.main',
              color: 'common.black',
              fontWeight: 700,
              fontSize: '1.25rem',
            },
            '.MuiButtonBase-root:hover': {
              backgroundColor: 'primary.main',
            },
            '.Mui-disabled': {
              backgroundColor: 'common.black_20',
              color: 'common.black_60',
            },
          }}
        >
          {actionButton}
        </DialogActions>
      )}
    </Dialog>
  );
};

interface IBookingQRCodeDialogProps {}

export const BookingQRCodeDialog: FC<IBookingQRCodeDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialog = useAppSelector(({ customerReservation }) => customerReservation.dialog);
  const token = useAppSelector(({ auth }) => auth.userToken);

  const checkInQRCode =
    (import.meta.env.DEV ? 'http://' : 'https://') + window.location.host + '/orders?token=' + token ?? '';

  const handleClose = () => {
    dispatch(setDialog());
  };

  return (
    <MobileDialogLayout
      title='客人桌邊點餐 QR Code'
      titleSize='h2'
      isOpen={dialog === CustomerBookingDialog.QRCODE}
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
