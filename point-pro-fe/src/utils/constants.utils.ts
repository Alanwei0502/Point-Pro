import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material';
import { OrderStatus, SelectionType, Gender, SeatStatus, OrderType } from '~/types';

// 專門放固定參數
export const MEAL_IMAGE_URL = 'https://i.imgur.com/';
export const MEAL_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MEAL_IMAGE_SIZE_LIMIT = 2 * 1024 * 1024;
export const MEAL_IMAGE_FORMAT_REMINDER = '圖片大小不得超過 2MB，格式為 .jpg、.jpeg 或 .png';

export const genderObj = {
  [Gender.MALE]: '先生',
  [Gender.FEMALE]: '小姐',
  [Gender.OTHER]: '',
};

export const selectionTypeObj = {
  [SelectionType.SINGLE]: '單選',
  [SelectionType.MULTIPLE]: '多選',
};

export const orderStatusObj = {
  [OrderStatus.WORKING]: '未完成',
  [OrderStatus.FINISHED]: '已完成',
  [OrderStatus.CANCEL]: '已取消',
};

export const orderTypeObj = {
  [OrderType.DINE_IN]: '內用',
  [OrderType.TAKE_OUT]: '外帶',
};

export const cityList = [
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

export const contactTimeList = ['9:00~11:30', '13:00~18:00', '18:00之後'];

export const seatStatusList = [
  { id: SeatStatus.AVAILABLE, title: '未使用', color: '#F2F2F2' },
  { id: SeatStatus.BOOKED, title: '已預訂', color: '#CFF561' },
  { id: SeatStatus.INUSE, title: '使用中', color: '#FEE391' },
];

export const seatStatusListObj = seatStatusList.reduce((obj: { [key: string]: any }, currnt) => ({ ...obj, [currnt.id]: currnt }), {});

export const reservationStatusList = [
  { id: 'NOT_ATTENDED', title: '未入席', color: '#CFF561' },
  { id: 'IN_USE', title: '使用中', color: '#FEE391' },
  { id: 'COMPLETED', title: '已完成', color: '#D1D1D1' },
];

export const reservationStatusListObj = reservationStatusList.reduce((obj: { [key: string]: any }, currnt) => ({ ...obj, [currnt.id]: currnt }), {});
