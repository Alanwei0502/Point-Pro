import { FC, useEffect } from 'react';
import { ButtonBase, DialogActions, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersActionBarProps } from '@mui/x-date-pickers';
import { Loading } from '~/components';
import { appDayjs, formatTimeOnly, formatDateOnly } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setAdultsAmount, setDate, setReservedAt, getPeriodByDate } from '~/store/slices';

interface IPeopleAndTimeProps {}

export const PeopleAndTime: FC<IPeopleAndTimeProps> = () => {
  const dispatch = useAppDispatch();

  const selectedDate = useAppSelector(({ period }) => period.selectedDate);
  const available = useAppSelector(({ period }) => period.availablePeriods);
  const availableDate = available.map((p) => formatDateOnly(p.startTime));
  console.log('appDayjs', appDayjs(selectedDate).startOf('date'));
  const availableSlots = available.filter((p) => formatDateOnly(p.startTime) === formatDateOnly(selectedDate));
  console.log('PeopleAndTime', availableSlots);

  const availablePeriods = useAppSelector(({ customerReservation }) => customerReservation.availablePeriods);
  const choosedDate = useAppSelector(({ customerReservation }) => customerReservation.choosedDate);
  const reservedAt = useAppSelector(({ customerReservation }) => customerReservation.reservationParams.reservedAt);
  const adults = useAppSelector(({ customerReservation }) => customerReservation.reservationParams.user.adults);

  const isLoading = useAppSelector(({ customerReservation }) => customerReservation.isLoading);

  const choosedPeriodInfo = availablePeriods.find((e) => e.startTime === reservedAt);
  const adultOptionList =
    choosedPeriodInfo && choosedPeriodInfo.available > 10
      ? [1, 2, 3, 4, 7, 8, 9, 10]
      : Array.from({ length: choosedPeriodInfo?.available ?? 0 }, (_, i) => i + 1);

  useEffect(() => {
    // dispatch(getPeriodByDate({ date: choosedDate }));
  }, [choosedDate, dispatch]);

  const handleChangeAdultsAmount = (e: SelectChangeEvent<`${number}`>) => {
    dispatch(setAdultsAmount(+e.target.value));
  };

  const handleChangeBookingDate = (value: appDayjs.Dayjs | null) => {
    dispatch(setDate(value ?? appDayjs()));
  };

  const handleChangeReservedPeriod = (e: SelectChangeEvent<string>) => {
    dispatch(setReservedAt(e.target.value));
  };

  if (isLoading) {
    return <Loading open={isLoading} />;
  }

  return (
    <>
      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>用餐日期</FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            defaultValue={selectedDate}
            value={selectedDate}
            format='MM月DD日 星期dd'
            onChange={handleChangeBookingDate}
            views={['day']}
            disablePast
            shouldDisableDate={(day) => !availableDate.includes(formatDateOnly(day))}
            slots={{
              actionBar: (props: PickersActionBarProps) => (
                <DialogActions className={props.className} sx={{ padding: '.5rem' }}>
                  <ButtonBase
                    onClick={props.onAccept}
                    sx={{
                      fontSize: 'body1.fontSize',
                      bgcolor: 'primary.main',
                      padding: '.5rem',
                      borderRadius: '.5rem',
                      width: '100%',
                    }}
                  >
                    確定
                  </ButtonBase>
                </DialogActions>
              ),
            }}
            slotProps={{
              toolbar: {
                hidden: true,
              },
              actionBar: {
                actions: ['accept'],
              },
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>用餐時段</FormLabel>
        <Select onChange={handleChangeReservedPeriod} value={`${reservedAt}`}>
          {availableSlots.map((slot) => (
            <MenuItem value={`${slot.startTime}`} key={slot.id}>
              {formatTimeOnly(slot.startTime)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl margin='normal' fullWidth>
        <FormLabel sx={{ fontWeight: 700, color: 'common.black' }}>用餐人數</FormLabel>
        <Select onChange={handleChangeAdultsAmount} value={`${adults}`}>
          {adultOptionList.map((value) => (
            <MenuItem value={`${value}`} key={value}>
              {`${value} 位`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* [TODO]: no api, temporarily hide */}
      {/* <BaseButton
        onClick={handleOpenBookingSearch}
        sx={{ textDecoration: "underline", fontWeight: 700, fontSize: "body1.fontSize", mt: "2rem" }}
      >
        我已經有預約了，查詢預訂資訊
      </BaseButton> */}
    </>
  );
};
