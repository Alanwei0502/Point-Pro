import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { appDayjs, formatTimeLeft, formatTimeOnly } from '~/utils';
import { ROUTE_PATH } from '~/constants';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { dineInTokenSliceActions } from '~/store/slices';

const { removeDineInToken } = dineInTokenSliceActions;

interface IRemainTimeProps {}
export const RemainTime: FC<IRemainTimeProps> = () => {
  const dispatch = useAppDispatch();

  const startAt = useAppSelector((state) => state.dineInToken.startAt);

  const endAt = appDayjs(startAt).add(2, 'hour');

  const [remainTime, setRemainTime] = useState(endAt.diff());

  useEffect(() => {
    if (remainTime <= 0) {
      dispatch(removeDineInToken());
      window.location.replace(`/${ROUTE_PATH.menu}`);
      return;
    }

    const timer = setTimeout(() => {
      setRemainTime(appDayjs(endAt).diff());
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainTime, dispatch, endAt]);

  return (
    <Box color='common.black' fontWeight={700}>
      {remainTime <= 0 ? '用餐時間結束' : formatTimeLeft(remainTime)}
    </Box>
  );
};

interface IDineInInfoProps {}
export const DineInInfo: FC<IDineInInfoProps> = () => {
  const startAt = useAppSelector((state) => state.dineInToken.startAt);
  const people = useAppSelector((state) => state.dineInToken.people);

  return (
    <Box sx={{ userSelect: 'none' }}>
      <Typography variant='h6' fontWeight={700} pb={0.5}>
        內用資訊
      </Typography>
      <Grid container p='0.5rem' borderRadius='5px' bgcolor='common.black_20' color='common.black_60'>
        <Grid item xs={4} py={0} px={0.5}>
          <Box color='common.black_60'>人數</Box>
          <Box color='common.black' fontWeight={700}>
            {people} 位
          </Box>
        </Grid>
        <Grid item xs={4} py={0} px={0.5}>
          <Box color='common.black_60'>入座時間</Box>
          <Box color='common.black' fontWeight={700}>
            {formatTimeOnly(startAt)}
          </Box>
        </Grid>
        <Grid item xs={4} py={0} px={0.5}>
          <Box color='common.black_60'>剩餘時間</Box>
          <RemainTime />
        </Grid>
      </Grid>
    </Box>
  );
};
