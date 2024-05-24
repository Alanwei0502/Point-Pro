import { FC, useEffect, useMemo } from 'react';
import { Box, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import { BaseButton, Loading } from '~/components';
import { appDayjs, formatTimeOnly, formatDateOnly } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setPeople, setSelectedDate, setSelectedPeriod, getAvailablePeriods, setDialog } from '~/store/slices';
import { CustomerBookingDialog } from '~/types';

const formLabelStyle: SxProps<Theme> | undefined = { fontWeight: 700, color: 'common.black' };

interface IPeopleAndTimeProps {}

export const PeopleAndTime: FC<IPeopleAndTimeProps> = () => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(({ booking }) => booking.isLoading);
  const availableTime = useAppSelector(({ booking }) => booking.availableTime);
  const selectedDate = useAppSelector(({ booking }) => booking.selectedDate);
  const selectedPeriod = useAppSelector(({ booking }) => booking.selectedPeriod);
  const people = useAppSelector(({ booking }) => booking.people);

  const availableDate = useMemo(() => availableTime.map((p) => formatDateOnly(p.startTime)), [availableTime]);

  const availablePeriods = useMemo(
    () => availableTime.filter((p) => appDayjs(p.startTime).isSame(selectedDate, 'day')),
    [availableTime, selectedDate],
  );

  const availablePeopleOptions = useMemo(() => {
    if (!selectedPeriod) return [];

    const choosedPeriodInfo = availableTime.find((i) => appDayjs(i.startTime).isSame(selectedPeriod.startTime));

    if (!choosedPeriodInfo) return [];

    return choosedPeriodInfo.available > 10
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      : Array.from({ length: choosedPeriodInfo.available }, (_, i) => i + 1);
  }, [availableTime, selectedPeriod]);

  useEffect(() => {
    dispatch(getAvailablePeriods());
  }, [dispatch]);

  const handleSelectedPeople = (e: SelectChangeEvent<`${number}`>) => {
    dispatch(setPeople(+e.target.value));
  };

  const handleSelectedDate = (value: appDayjs.Dayjs | null) => {
    if (!value) return;
    dispatch(setSelectedDate(value));
  };

  const handleSelectedPeriod = (e: SelectChangeEvent<string>) => {
    const selectedStartTime = e.target.value;
    const selectedPeriod = availablePeriods.find((p) => `${p.startTime}` === selectedStartTime);
    if (!selectedPeriod) return;
    dispatch(setSelectedPeriod({ id: selectedPeriod.id, startTime: selectedPeriod.startTime }));
  };

  const handleOpenBookingSearch = () => {
    dispatch(setDialog(CustomerBookingDialog.RECORD_QUERY));
  };

  return isLoading ? (
    <Loading open={isLoading} />
  ) : (
    <Box height={800}>
      <FormControl margin='normal' fullWidth required>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={selectedDate}
            value={selectedDate}
            views={['day']}
            onChange={handleSelectedDate}
            disablePast
            shouldDisableDate={(day) => !availableDate.includes(formatDateOnly(day))}
            sx={{
              margin: '0',
              width: '100%',
            }}
          />
        </LocalizationProvider>
      </FormControl>

      <FormControl margin='normal' fullWidth required>
        <FormLabel sx={formLabelStyle}>用餐時段</FormLabel>
        <Select onChange={handleSelectedPeriod} value={`${selectedPeriod?.startTime ?? ''}`} displayEmpty>
          <MenuItem disabled value=''>
            請選擇
          </MenuItem>
          {availablePeriods.map((slot) => (
            <MenuItem value={`${slot.startTime}`} key={slot.id}>
              {formatTimeOnly(slot.startTime)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl margin='normal' fullWidth required>
        <FormLabel sx={formLabelStyle}>用餐人數</FormLabel>
        <Select onChange={handleSelectedPeople} value={`${people}`}>
          <MenuItem disabled value='0'>
            請選擇
          </MenuItem>
          {availablePeopleOptions.map((value) => (
            <MenuItem value={`${value}`} key={value}>
              {`${value} 位`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <BaseButton
        onClick={handleOpenBookingSearch}
        sx={{
          textDecoration: 'underline',
          fontWeight: 700,
          fontSize: 'body1.fontSize',
          mt: '2rem',
          color: 'common.black',
        }}
      >
        我已經有預約了，查詢預訂資訊
      </BaseButton>
    </Box>
  );
};
