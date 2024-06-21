import { useEffect, FC, useState, ChangeEvent } from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridValueFormatterParams, GridValueGetterParams } from '@mui/x-data-grid';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  GRID_DEFAULT_LOCALE_TEXT,
  formatTimeOnly,
  GENDER_TRANSLATE,
  RESERVATION_PERIODS,
  RESERVATION_PEOPLE_OPTIONS,
  RESERVATION_STATUS,
  getReservationStatusLabel,
  RESERVATION_STATUS_OPTIONS,
  appDayjs,
} from '~/utils';
import { headerHeight } from '~/components';
import { OrderType, ReservationInfo, ReservationModalType } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { IPaymentSliceState, paymentSliceActions, reservationManagementSliceActions } from '~/store/slices';
import { theme } from '~/theme';
import { ReservationToolbar } from './ReservationToolbar';
import { ReservationTablePagination } from './ReservationPagination';

const defaultPage = 0;
const defaultRowsPerPage = 20;
const { getReservations, openModal, openDeleteReservationConfirmModal, openStartDiningConfirmModal } = reservationManagementSliceActions;
const { openPaymentModal } = paymentSliceActions;

const allReservationStatus = Object.values(RESERVATION_STATUS);

interface IReservationListProps {}

export const ReservationTable: FC<IReservationListProps> = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.reservationManagement.loading);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);
  const reservations = useAppSelector((state) => state.reservationManagement.reservations);
  const clock = useAppSelector((state) => state.adminUI.clock);

  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(defaultPage);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  const handleClickStartDining = (params: ReservationInfo) => {
    dispatch(
      openStartDiningConfirmModal({
        id: params.id,
        username: params.username,
        gender: params.gender,
      }),
    );
  };

  const handleClickCheckout = (params: ReservationInfo, modalType: IPaymentSliceState['paymentModal']['modalType']) => {
    dispatch(
      openPaymentModal({
        modalType,
        data: {
          type: OrderType.DINE_IN,
          reservationId: params.id,
        },
      }),
    );
  };

  const handleClickEdit = (params: ReservationInfo) => {
    dispatch(
      openModal({
        modalType: ReservationModalType.EDIT,
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

  const handleClickDelete = (params: ReservationInfo) => {
    dispatch(
      openDeleteReservationConfirmModal({
        id: params.id,
        username: params.username,
        gender: params.gender,
      }),
    );
  };

  useEffect(() => {
    dispatch(getReservations(dateFilter));
  }, [dispatch, dateFilter]);

  return (
    <Box height={`calc(100vh - ${headerHeight})`}>
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
            field: 'status',
            headerName: '狀態',
            width: 110,
            sortable: false,
            type: 'singleSelect',
            valueOptions: RESERVATION_STATUS_OPTIONS,
            valueGetter: (params: GridValueGetterParams<ReservationInfo>) => {
              return getReservationStatusLabel({ params: params.row, clock });
            },
            renderCell: (params: GridRenderCellParams<ReservationInfo>) => {
              const value = allReservationStatus.find((v) => v.label === params.value);
              if (!value) return null;
              return <Chip icon={value.icon} label={value.label} variant='outlined' color={value.color} size='small' />;
            },
          },
          {
            field: 'username',
            headerName: '姓名',
            minWidth: 140,
            sortable: false,
            valueGetter: (params: GridValueGetterParams<ReservationInfo>) => {
              const { username, gender } = params.row;
              return `${username} ${GENDER_TRANSLATE[gender]}`;
            },
          },
          { field: 'phone', headerName: '電話號碼', sortable: false, width: 140 },
          {
            field: 'startTime',
            headerName: '預約時間',
            width: 170,
            type: 'singleSelect',
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
          { field: 'remark', headerName: '備註', sortable: false, minWidth: 120, flex: 1 },
          {
            field: 'actions',
            headerName: '操作',
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            width: 140,
            renderCell: (params: GridRenderCellParams<ReservationInfo>) => {
              return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['未到', '通知', '遲到'].includes(getReservationStatusLabel({ params: params.row, clock })) && (
                    <IconButton size='small' aria-label='用餐' onClick={() => handleClickStartDining(params.row)}>
                      <DinnerDiningIcon />
                    </IconButton>
                  )}
                  {['用餐', '超時'].includes(getReservationStatusLabel({ params: params.row, clock })) && (
                    <IconButton size='small' aria-label='結帳' onClick={() => handleClickCheckout(params.row, 'EDIT')}>
                      <PointOfSaleIcon />
                    </IconButton>
                  )}
                  {['結束'].includes(getReservationStatusLabel({ params: params.row, clock })) && (
                    <IconButton size='small' aria-label='訂單記錄' onClick={() => handleClickCheckout(params.row, 'VIEW')}>
                      <ReceiptIcon />
                    </IconButton>
                  )}
                  <IconButton size='small' aria-label='編輯' onClick={() => handleClickEdit(params.row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    aria-label='取消'
                    onClick={() => handleClickDelete(params.row)}
                    disabled={!['未到', '通知', '遲到'].includes(getReservationStatusLabel({ params: params.row, clock }))}
                  >
                    <CancelIcon />
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
