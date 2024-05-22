import { FC, useState } from 'react';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import { MobileDialogLayout } from '~/components';
import { CustomerBookingDialog } from '~/types';
import { phoneRegex } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getBookingRecord, setReservationPhone, setDialog } from '~/store/slices';

interface BookingRecordQueryModalProps {}

export const BookingRecordQueryModal: FC<BookingRecordQueryModalProps> = () => {
  const dispatch = useAppDispatch();

  const reservationPhone = useAppSelector(({ customerReservation }) => customerReservation.reservationPhone);
  const dialog = useAppSelector(({ customerReservation }) => customerReservation.dialog);

  const [isPhoneError, setIsPhoneError] = useState(true);

  const handleClose = () => {
    dispatch(setDialog());
  };

  const handleQuery = () => {
    if (!reservationPhone) return;
    dispatch(getBookingRecord(reservationPhone));
  };

  const handleQueryString = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isValidated = phoneRegex.test(e.target.value);
    setIsPhoneError(!isValidated);
    dispatch(setReservationPhone(isValidated ? e.target.value : ''));
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
        <TextField placeholder='0987654321' onChange={handleQueryString} />
      </FormControl>
    </MobileDialogLayout>
  );
};
