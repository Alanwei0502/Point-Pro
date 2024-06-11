import { useEffect, FC, useState, ChangeEvent } from 'react';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GRID_DEFAULT_LOCALE_TEXT, formatTimeOnly, GENDER_TRANSLATE, RESERVATION_PERIODS, RESERVATION_PEOPLE_OPTIONS } from '~/utils';
import { AppButton, headerHeight } from '~/components';
import { ReservationInfo, ReservationType } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { IReservationManagementSliceState, ReservationModalType, reservationManagementSliceActions } from '~/store/slices';
import { theme } from '~/theme';
import { ReservationToolbar } from './ReservationToolbar';
import { ReservationTablePagination } from './ReservationPagination';

const defaultPage = 0;
const defaultRowsPerPage = 20;
const { getReservations, openModal } = reservationManagementSliceActions;

interface IReservationListProps {}

export const ReservationList: FC<IReservationListProps> = (props) => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.reservationManagement.loading);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);
  const reservations = useAppSelector((state) => state.reservationManagement.reservations);

  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(defaultPage);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  const handleClickAction = (type: ReservationModalType, params: ReservationInfo) => {
    dispatch(
      openModal({
        type,
        data: {
          id: params.id,
          type: params.type,
          username: params.username,
          phone: params.phone,
          email: params.email,
          gender: params.gender,
          people: params.people,
          remark: params.remark,
          selectedPeriod: {
            id: params.periods.id,
            startTime: params.periods.startTime,
          },
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(getReservations(dateFilter));
  }, [dispatch, dateFilter]);

  // // [TODO] Socket
  // const notifications = useAppSelector(({ socket }) => socket.notifications);
  // useEffect(() => {
  //   if (notifications.length > 0 && notifications[0].message === ReservationMessage.CREATE_RESERVATION) {
  //     dispatchGetReservation();
  //   }
  // }, [notifications]);

  // const dispatchGetReservation = async () => {
  //   const { result } = await dispatch(getReservations(dateFilter)).unwrap();
  //   const list = result?.map((e: ReservationInfo) => ({
  //     ...e,
  //     ...e.options,
  //     seatNo: e.seats.map((seat) => seat.seatNo).join(', '),
  //     people: e.options,
  //   })) as GridRowsProp;

  //   setReservations(list);
  // };

  return (
    <Box
      sx={{
        height: `calc(100vh - ${headerHeight})`,
      }}
    >
      <DataGrid
        loading={loading}
        rows={reservations}
        isCellEditable={() => false}
        localeText={GRID_DEFAULT_LOCALE_TEXT}
        rowSelection
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
          },
        }}
        initialState={{
          sorting: {
            sortModel: [{ field: 'startTime', sort: 'asc' }],
          },
        }}
        columns={[
          {
            field: 'username',
            headerName: '姓名',
            minWidth: 160,
            valueGetter: (params: GridValueGetterParams<ReservationInfo>) => {
              const { username, gender } = params.row;
              return `${username} ${GENDER_TRANSLATE[gender]}`;
            },
          },
          { field: 'phone', headerName: '電話號碼', width: 170 },
          {
            field: 'startTime',
            headerName: '預約時間',
            type: 'singleSelect',
            width: 180,
            valueOptions: RESERVATION_PERIODS,
            valueGetter: (params: GridValueGetterParams<ReservationInfo>) => {
              return formatTimeOnly(params.row.periods.startTime);
            },
            valueFormatter: (params: GridValueFormatterParams<ReservationInfo['periods']['startTime']>) => {
              return params.value ?? '-';
            },
          },
          {
            field: 'people',
            headerName: '人數',
            type: 'singleSelect',
            valueOptions: RESERVATION_PEOPLE_OPTIONS,
            width: 140,
            valueFormatter: (params: GridValueFormatterParams<ReservationInfo['people']>) => `${params.value} 位`,
          },
          { field: 'remark', headerName: '備註', minWidth: 140, flex: 1 },
          {
            field: 'actions',
            headerName: '操作',
            width: 120,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<ReservationInfo>) => {
              return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size='small' onClick={() => handleClickAction(ReservationModalType.EDIT, params.row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size='small' onClick={() => handleClickAction(ReservationModalType.DELETE, params.row)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              );
            },
          },
        ]}
        slots={{ pagination: ReservationTablePagination, toolbar: ReservationToolbar }}
        slotProps={{
          pagination: {
            count: reservations.length,
            page,
            rowsPerPage,
            onPageChange: handleChangePage,
            onRowsPerPageChange: handleChangeRowsPerPage,
          },
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: {
              placeholder: '快速搜尋',
            },
            csvOptions: {
              disableToolbarButton: true,
            },
            printOptions: {
              disableToolbarButton: true,
            },
          },
        }}
        paginationModel={{ page, pageSize: rowsPerPage }}
        disableDensitySelector
      />
    </Box>
  );
};
