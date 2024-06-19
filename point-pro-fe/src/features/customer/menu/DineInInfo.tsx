import { FC, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { appDayjs, formatFullDateWithTime, formatTimeLeft, formatTimeOnly } from '~/utils';

interface IDineInInfoProps {}

export const DineInInfo: FC<IDineInInfoProps> = () => {
  const people = sessionStorage.getItem('people');
  const startAt = sessionStorage.getItem('startAt');
  const endAt = appDayjs(startAt).add(2, 'hour');

  const [remainTime, setRemainTime] = useState(endAt.diff());

  useEffect(() => {
    if (remainTime <= 0) return;

    const timer = setTimeout(() => {
      setRemainTime(appDayjs(endAt).diff());
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainTime, endAt]);

  return (
    <Box sx={{ userSelect: 'none' }}>
      <Typography variant='h6' fontWeight={700} pb={0.5}>
        內用資訊
      </Typography>
      <Grid
        container
        sx={{
          padding: '0.5rem',
          borderRadius: '5px',
          bgcolor: 'common.black_20',
          color: 'common.black_60',
        }}
      >
        <Grid item xs={4} sx={{ padding: '0 0.5rem' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>人數</Box>
          <Box sx={{ fontWeight: 700, color: 'common.black' }}>{people} 位</Box>
        </Grid>
        <Grid item xs={4} sx={{ padding: '0 0.5rem' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>入座時間</Box>
          <Box sx={{ fontWeight: 700, color: 'common.black' }}>{formatTimeOnly(startAt)}</Box>
        </Grid>
        <Grid item xs={4} sx={{ padding: '0 0.5rem' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>剩餘時間</Box>
          <Box sx={{ fontWeight: 700, color: 'common.black' }}>{remainTime <= 0 ? '用餐時間結束' : formatTimeLeft(remainTime)}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};
