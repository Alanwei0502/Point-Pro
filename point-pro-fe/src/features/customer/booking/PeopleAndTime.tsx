import { FC, useEffect, useMemo } from 'react';
import { Box, FormControl, FormLabel, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers';
import { Loading } from '~/components';
import { appDayjs, formatTimeOnly, formatDateOnly, RESERVATION_PEOPLE_OPTIONS } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setPeople, setSelectedDate, setSelectedPeriod, getAvailablePeriods } from '~/store/slices';

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

    return choosedPeriodInfo.capacity > 10 ? RESERVATION_PEOPLE_OPTIONS : Array.from({ length: choosedPeriodInfo.capacity }, (_, i) => i + 1);
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

  return isLoading ? (
    <Loading open={isLoading} />
  ) : (
    <Box height={700}>
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
          {availablePeriods.map((p) => (
            <MenuItem value={`${p.startTime}`} key={p.id} disabled={p.capacity === 0 || appDayjs(p.startTime).isBefore(appDayjs())}>
              {formatTimeOnly(p.startTime)}
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
    </Box>
  );
};
