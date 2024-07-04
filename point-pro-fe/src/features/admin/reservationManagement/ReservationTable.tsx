import { FC, useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  type GridLocaleText,
  type GridRenderCellParams,
  type GridValueFormatterParams,
  type GridValueGetterParams,
} from '@mui/x-data-grid';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { GENDER_TRANSLATE, RESERVATION_PERIODS, RESERVATION_PEOPLE_OPTIONS, RESERVATION_STATUS, RESERVATION_STATUS_OPTIONS } from '~/constants';
import { formatTimeOnly, getReservationStatusLabel } from '~/utils';
import { headerHeight } from '~/components';
import { OrderType, ReservationInfo, ReservationModalType } from '~/types';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { IPaymentSliceState, paymentSliceActions } from '~/store/slices/admin/payment.slice';
import { reservationManagementSliceActions } from '~/store/slices/admin/reservationManagement.slice';
import { theme } from '~/theme';
import { ReservationToolbar } from './ReservationToolbar';
import { ReservationTablePagination } from './ReservationPagination';

const defaultPage = 0;
const defaultRowsPerPage = 20;
const { openModal, openDeleteReservationConfirmModal, openStartDiningConfirmModal } = reservationManagementSliceActions;
const { openPaymentModal } = paymentSliceActions;

const allReservationStatus = Object.values(RESERVATION_STATUS);

const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
  // Root
  noRowsLabel: '無資料',
  noResultsOverlayLabel: '查無資料',

  // Density selector toolbar button text
  toolbarDensity: 'Density',
  toolbarDensityLabel: 'Density',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Comfortable',

  // Columns selector toolbar button text
  toolbarColumns: '欄位',
  toolbarColumnsLabel: '選擇欄位',

  // Filters toolbar button text
  toolbarFilters: '篩選器',
  toolbarFiltersLabel: '顯示刪選器',
  toolbarFiltersTooltipHide: '隱藏篩選器',
  toolbarFiltersTooltipShow: '顯示篩選器',
  toolbarFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '',
  toolbarQuickFilterLabel: '搜尋',
  toolbarQuickFilterDeleteIconLabel: '清除',

  // Export selector toolbar button text
  toolbarExport: '匯出',
  toolbarExportLabel: '匯出',
  toolbarExportCSV: '下載成 CSV',
  toolbarExportPrint: '列印',
  toolbarExportExcel: '下載成 Excel',

  // Filter panel text
  filterPanelAddFilter: '新增篩選器',
  filterPanelRemoveAll: '移除所有篩選器',
  filterPanelDeleteIconLabel: '刪除',
  filterPanelLogicOperator: '邏輯運算',
  filterPanelOperator: '操作',
  filterPanelOperatorAnd: '和',
  filterPanelOperatorOr: '或',
  filterPanelColumns: '欄位',
  filterPanelInputLabel: '值',
  filterPanelInputPlaceholder: '',

  // Filter operators text
  filterOperatorContains: '包含',
  filterOperatorEquals: '等於',
  filterOperatorStartsWith: '起始於',
  filterOperatorEndsWith: '結束於',
  filterOperatorIs: '是',
  filterOperatorNot: '不是',
  filterOperatorAfter: '在此之後',
  filterOperatorOnOrAfter: '在此之後（包含）',
  filterOperatorBefore: '在此之前',
  filterOperatorOnOrBefore: '在此之前（包含）',
  filterOperatorIsEmpty: '是空值',
  filterOperatorIsNotEmpty: '不是空值',
  filterOperatorIsAnyOf: '是以下任一個',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: '包含',
  headerFilterOperatorEquals: '等於',
  headerFilterOperatorStartsWith: '起始於',
  headerFilterOperatorEndsWith: '結束於',
  headerFilterOperatorIs: '是',
  headerFilterOperatorNot: '不是',
  headerFilterOperatorAfter: '在此之後',
  headerFilterOperatorOnOrAfter: '在此之後（包含）',
  headerFilterOperatorBefore: '在此之前',
  headerFilterOperatorOnOrBefore: '在此之前（包含）',
  headerFilterOperatorIsEmpty: '是空值',
  headerFilterOperatorIsNotEmpty: '不是空值',
  headerFilterOperatorIsAnyOf: '是以下任一個',
  'headerFilterOperator=': '等於',
  'headerFilterOperator!=': '不等於',
  'headerFilterOperator>': '大於',
  'headerFilterOperator>=': '大於等於',
  'headerFilterOperator<': '小於',
  'headerFilterOperator<=': '小於等於',

  // Filter values text
  filterValueAny: '任何值',
  filterValueTrue: 'true',
  filterValueFalse: 'false',

  // Column menu text
  columnMenuLabel: '選單',
  columnMenuShowColumns: '顯示欄位',
  columnMenuManageColumns: '管理欄位',
  columnMenuFilter: '篩選',
  columnMenuHideColumn: '隱藏此欄位',
  columnMenuUnsort: '不排序',
  columnMenuSortAsc: '升冪排序',
  columnMenuSortDesc: '降冪排序',

  // Column Panel
  columnsPanelTextFieldLabel: '搜尋欄位',
  columnsPanelTextFieldPlaceholder: '欄位名稱',
  columnsPanelDragIconLabel: '重新排序列',
  columnsPanelShowAllButton: <Box sx={{ color: theme.palette.secondary.light, fontSize: 16 }}>顯示全部</Box>,
  columnsPanelHideAllButton: <Box sx={{ color: theme.palette.secondary.light, fontSize: 16 }}>隱藏全部</Box>,

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => (count !== 1 ? `${count} active filters` : `${count} active filter`),
  columnHeaderFiltersLabel: '顯示所有篩選器',
  columnHeaderSortIconLabel: '排序',

  // Rows selected footer text
  footerRowSelected: () => '',
  // footerRowSelected: (count) => `已選擇 ${count.toLocaleString()} 列`,

  // Total row amount footer text
  footerTotalRows: '總共筆數:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '複選框選擇',
  checkboxSelectionSelectAllRows: '全選',
  checkboxSelectionUnselectAllRows: '取消全選',
  checkboxSelectionSelectRow: '選擇列',
  checkboxSelectionUnselectRow: '取消選擇列',

  // Boolean cell text
  booleanCellTrueLabel: '是',
  booleanCellFalseLabel: '否',

  // Actions cell more text
  actionsCellMore: '更多',

  // Column pinning text
  pinToLeft: '固定在左側',
  pinToRight: '固定在右側',
  unpin: '取消固定',

  // Tree Data
  treeDataGroupingHeaderName: '分組',
  treeDataExpand: 'see children',
  treeDataCollapse: 'hide children',

  // Grouping columns
  groupingColumnHeaderName: '分組',
  groupColumn: (name) => `透過 ${name} 分組`,
  unGroupColumn: (name) => `取消透過 ${name} 分組`,

  // Master/detail
  detailPanelToggle: '詳細資訊面板切換',
  expandDetailPanel: '展開',
  collapseDetailPanel: '收合',

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: '重新排序列',

  // Aggregation
  aggregationMenuItemHeader: '聚合函數',
  aggregationFunctionLabelSum: '總和',
  aggregationFunctionLabelAvg: '平均',
  aggregationFunctionLabelMin: '最小值',
  aggregationFunctionLabelMax: '最大值',
  aggregationFunctionLabelSize: 'size',
};

interface IReservationListProps {}

export const ReservationTable: FC<IReservationListProps> = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.reservationManagement.loading);
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
