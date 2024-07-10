import { FC, useRef } from 'react';
import Box from '@mui/material/Box';
import { GridToolbar, type GridToolbarProps } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppButton } from '~/components';
import { appDayjs, debounce } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices/admin/reservationManagement.slice';
import { ReservationModalType } from '~/types';

const { setDateFilter, openModal, getReservations } = reservationManagementSliceActions;

const ReservationToolbar: FC<GridToolbarProps> = (props) => {
  const dispatch = useAppDispatch();

  const debouncedChangeDateFilter = useRef(
    debounce(
      (date: appDayjs.Dayjs | null) => {
        const dateFilter = date?.toISOString() ?? '';
        dispatch(setDateFilter(dateFilter));
        dispatch(getReservations(dateFilter));
      },
      500,
      { leading: true },
    ),
  ).current;

  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const handleChangeDateFilter = (date: appDayjs.Dayjs | null) => {
    debouncedChangeDateFilter(date);
  };

  const handleClickCreateReservation = () => {
    dispatch(openModal({ modalType: ReservationModalType.CREATE }));
  };

  return (
    <Box display='flex' alignItems='center' p={1}>
      <Box display='flex' alignItems='center' p={1} gap={1}>
        <AppButton onClick={() => handleChangeDateFilter(appDayjs())}>今天</AppButton>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            value={appDayjs(dateFilter)}
            format='YYYY年MM月DD日 (星期dd)'
            onChange={handleChangeDateFilter}
            sx={{
              '& .MuiOutlinedInput-root': {
                width: 250,
              },
              '& .MuiInputBase-input': {
                padding: '.5rem',
              },
            }}
          />
        </LocalizationProvider>
      </Box>
      <GridToolbar {...props}></GridToolbar>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 2, gap: 2 }}>
        <AppButton onClick={handleClickCreateReservation} startIcon={<AddIcon />}>
          新增
        </AppButton>
      </Box>
    </Box>
  );
};

export default ReservationToolbar;
