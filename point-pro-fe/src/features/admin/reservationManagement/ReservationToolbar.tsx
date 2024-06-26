import { FC, useRef } from 'react';
import { debounce } from 'lodash';
import { Box } from '@mui/material';
import { GridToolbar, GridToolbarProps } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AppButton } from '~/components';
import { appDayjs } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices';
import { ReservationModalType } from '~/types';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const { setDateFilter, openModal, getReservations } = reservationManagementSliceActions;

export const ReservationToolbar: FC<GridToolbarProps> = (props) => {
  const dispatch = useAppDispatch();

  const debouncedChangeDateFilter = useRef(
    debounce(
      (date: appDayjs.Dayjs | null) => {
        const dateFilter = date?.toISOString() ?? '';
        dispatch(setDateFilter(dateFilter));
        dispatch(getReservations(dateFilter));
      },
      500,
      { leading: true, trailing: false },
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
