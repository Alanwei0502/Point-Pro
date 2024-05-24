import { FC, useState } from 'react';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { MobileDialogLayout } from '~/components';
import { CustomerBookingDialog } from '~/types';
import { phoneRegex } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeBookingRecordQueryDialog, getReservationByPhone, setPhone } from '~/store/slices';

interface BookingRecordQueryDialogProps {}

export const BookingRecordQueryDialog: FC<BookingRecordQueryDialogProps> = () => {
  const dispatch = useAppDispatch();

  const [isPhoneError, setIsPhoneError] = useState(false);

  const phone = useAppSelector(({ booking }) => booking.phone);
  const dialog = useAppSelector(({ booking }) => booking.dialog);

  const handleClose = () => {
    setIsPhoneError(false);
    dispatch(closeBookingRecordQueryDialog());
  };

  const handleQuery = () => {
    if (!phone) return;
    dispatch(getReservationByPhone(phone));
  };

  const handleQueryString = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = phoneRegex.test(e.target.value);
    setIsPhoneError(!isValidated);
    dispatch(setPhone(isValidated ? e.target.value : ''));
  };

  return (
    <MobileDialogLayout
      title='預訂查詢'
      titleSize='h2'
      isOpen={dialog === CustomerBookingDialog.RECORD_QUERY}
      onCloseDialog={handleClose}
      actionButton={
        <Button onClick={handleQuery} disabled={isPhoneError}>
          查詢
        </Button>
      }
    >
      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>請輸入訂位的手機號碼</FormLabel>
        <TextField
          placeholder='0987654321'
          onChange={handleQueryString}
          error={isPhoneError}
          helperText={isPhoneError && '手機號碼格式錯誤'}
        />
      </FormControl>
    </MobileDialogLayout>
  );
};
