import { ReactElement } from 'react';
import { Box, ChipTypeMap } from '@mui/material';
import { GridLocaleText } from '@mui/x-data-grid';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { theme } from '~/theme';
import { OrderStatus, SelectionType, Gender, OrderType } from '~/types';

export const MEAL_IMAGE_URL = 'https://i.imgur.com/';
export const MEAL_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MEAL_IMAGE_SIZE_LIMIT = 2 * 1024 * 1024;
export const MEAL_IMAGE_FORMAT_REMINDER = '圖片大小不得超過 2MB，格式為 .jpg、.jpeg 或 .png';

export const GENDER_TRANSLATE = {
  [Gender.MALE]: '先生',
  [Gender.FEMALE]: '小姐',
  [Gender.OTHER]: '',
};

export const SELECTION_TYPE_TRANSLATE = {
  [SelectionType.SINGLE]: '單選',
  [SelectionType.MULTIPLE]: '多選',
};

export const ORDER_STATUS_TRANSLATE = {
  [OrderStatus.WORKING]: '未完成',
  [OrderStatus.FINISHED]: '已完成',
  [OrderStatus.CANCEL]: '已取消',
};

export const ORDER_TYPE_TRANSLATE = {
  [OrderType.DINE_IN]: '內用',
  [OrderType.TAKE_OUT]: '外帶',
};

export const RESERVATION_STATUS: {
  [key: string]: {
    label: string;
    color: ChipTypeMap['props']['color'];
    icon: ReactElement;
  };
} = {
  NOT_ATTENDED: {
    label: '未到',
    color: 'default',
    icon: <HourglassTopIcon />,
  },
  REMIND: {
    label: '通知',
    color: 'primary',
    icon: <LocalPhoneIcon />,
  },
  LATE: {
    label: '遲到',
    color: 'error',
    icon: <AssignmentLateIcon />,
  },
  IN_USE: {
    label: '用餐',
    color: 'info',
    icon: <AirlineSeatReclineNormalIcon />,
  },
  OVERTIME: {
    label: '超時',
    color: 'warning',
    icon: <MoreTimeIcon />,
  },
  COMPLETED: {
    label: '結束',
    color: 'success',
    icon: <CheckCircleIcon />,
  },
};

export const CITY_LIST = [
  '臺北市',
  '新北市',
  '桃園市',
  '新竹市',
  '臺中市',
  '臺南市',
  '高雄市',
  '基隆市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義縣',
  '嘉義市',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '臺東縣',
  '金門縣',
  '澎湖縣',
  '連江縣',
];

export const RESERVATION_STATUS_OPTIONS = ['未到', '通知', '遲到', '用餐', '超時', '結束'];
export const RESERVATION_PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const RESERVATION_PERIODS = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

export const CONTACT_TIME_LIST = ['9:00~11:30', '13:00~18:00', '18:00之後'];

export const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText = {
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
