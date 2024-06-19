import appDayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/zh-tw';

appDayjs.extend(relativeTime);
appDayjs.extend(duration);
appDayjs.extend(utc);
appDayjs.extend(timezone);
appDayjs.extend(localizedFormat);
appDayjs.extend(advancedFormat);
appDayjs.extend(customParseFormat);
appDayjs.extend(isBetween);
appDayjs.extend(isYesterday);
appDayjs.extend(isToday);
appDayjs.extend(isTomorrow);
appDayjs.extend(relativeTime);
appDayjs.locale('zh-tw');
appDayjs.tz.setDefault('Asia/Taipei');

export const dateForm = {
  fullDateWithSecond: 'YYYY/MM/DD HH:mm:ss',
  fullDateWithTime: 'YYYY/MM/DD HH:mm',
  fullDate: 'YYYY/MM/DD',
  dateWithTime: 'MM/DD HH:mm',
  dateOnly: 'MM/DD',
  yearOnly: 'YYYY',
  timeOnly: 'HH:mm',
  fullDatePayload: 'YYYY-MM-DDT00:00:00',
  fullDateWithTimePayload: 'YYYY-MM-DDTHH:mm:ss',
};

export const formatFullDateWithTime = (date: appDayjs.ConfigType) => {
  return appDayjs(date).format(dateForm.fullDateWithTime);
};
export const formatFullDate = (date: appDayjs.ConfigType) => {
  return appDayjs(date).format(dateForm.fullDate);
};
export const formatDateWithTime = (date: appDayjs.ConfigType) => {
  return appDayjs(date).format(dateForm.dateWithTime);
};
export const formatDateOnly = (date: appDayjs.ConfigType) => {
  return appDayjs(date).format(dateForm.dateOnly);
};
export const formatTimeOnly = (date: appDayjs.ConfigType) => {
  return appDayjs(date).format(dateForm.timeOnly);
};
export const formatTimeLeft = (milliseconds: number) => {
  const timeDuration = appDayjs.duration(milliseconds);
  const hours = timeDuration.hours().toString().padStart(2, '0');
  const minutes = timeDuration.minutes().toString().padStart(2, '0');
  const seconds = timeDuration.seconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};
export const percentOfUsed = (start: appDayjs.ConfigType, end: appDayjs.ConfigType) => {
  const startAt = appDayjs(start);
  const endAt = appDayjs(end);
  return start && end ? `${Math.round((startAt.diff() / startAt.diff(endAt)) * 100)}%` : '';
};
export const convertToDatePayload = (date: appDayjs.ConfigType) => {
  const payload = date ?? appDayjs();
  return appDayjs(payload).isToday()
    ? appDayjs(payload).format(dateForm.fullDateWithTimePayload)
    : appDayjs(payload).format(dateForm.fullDatePayload);
};

export const getReservationPeriodsOptions = (date: appDayjs.ConfigType) => {
  const startOfDay = appDayjs(date).startOf('day');
  return [
    startOfDay.add(17.5, 'h').toISOString(),
    startOfDay.add(18, 'h').toISOString(),
    startOfDay.add(18.5, 'h').toISOString(),
    startOfDay.add(19, 'h').toISOString(),
    startOfDay.add(19.5, 'h').toISOString(),
    startOfDay.add(20, 'h').toISOString(),
    startOfDay.add(20.5, 'h').toISOString(),
    startOfDay.add(21, 'h').toISOString(),
    startOfDay.add(21.5, 'h').toISOString(),
  ];
};

export { appDayjs };
