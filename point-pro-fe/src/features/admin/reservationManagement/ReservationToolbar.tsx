import { FC } from 'react';
import { Box } from '@mui/material';
import { GridToolbar, GridToolbarProps } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppButton } from '~/components';
import { appDayjs } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { ReservationModalType, reservationManagementSliceActions } from '~/store/slices';

const { setDateFilter, openModal } = reservationManagementSliceActions;

export const ReservationToolbar: FC<GridToolbarProps> = (props) => {
  const dispatch = useAppDispatch();

  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const handleChangeDateFilter = (date: appDayjs.Dayjs | null) => {
    dispatch(setDateFilter(date));
  };

  const handleClickCreateReservation = () => {
    dispatch(openModal({ type: ReservationModalType.CREATE }));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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