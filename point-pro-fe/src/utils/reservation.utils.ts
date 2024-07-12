import { ReservationInfo } from '~/types';
import { appDayjs } from '~/utils';

interface IGetReservationStatusLabelProps {
  params: ReservationInfo;
  clock: string;
}

export const getReservationStatusLabel = ({ params, clock }: IGetReservationStatusLabelProps) => {
  const current = appDayjs(clock);
  const { startAt, endAt, allOrdersPaid } = params;
  const { startTime, endTime } = params.periods;

  if (!startAt && current.isBefore(startTime)) return '未到';
  if (!startAt && current.isBefore(appDayjs(startTime).add(10, 'minutes'))) return '通知';
  if (!startAt && current.isAfter(appDayjs(startTime).add(10, 'minutes'))) return '遲到';
  if (startAt && ((!endAt && current.isBefore(endTime)) || (endAt && !allOrdersPaid))) return '用餐';
  if (startAt && !endAt && current.isAfter(endTime)) return '超時';
  if (startAt && endAt && allOrdersPaid) return '結束';
  return '';
};
