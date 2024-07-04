import { ReactElement } from 'react';
import { ChipTypeMap } from '@mui/material/Chip';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { OrderStatus, SelectionType, Gender, OrderType, PaymentStatus } from '~/types';

export const ROUTE_PATH = {
  booking: 'booking',
  linepay: 'linepay',
  confirm: 'confirm',
  cancel: 'cancel',
  admin: 'admin',
  menu: 'menu',
  takeOrder: 'take_order',
  orderManagement: 'order_management',
  reservationMangement: 'reservation_mangament',
  menuManagement: 'menu_management',
};

export const IMAGE_URL = 'https://i.imgur.com/';
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

export const PAYMENT_STATUS = {
  [PaymentStatus.PAID]: '已付款',
  [PaymentStatus.UNPAID]: '未付款',
  [PaymentStatus.CANCEL]: '付款已取消',
};

export const RESERVATION_STATUS: {
  [key: PropertyKey]: {
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
