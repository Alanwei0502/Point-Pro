import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { formatFullDateWithTime } from '~/utils';

interface IUserInfoProps {}

export const UserInfo: FC<IUserInfoProps> = () => {
  const people = sessionStorage.getItem('people');
  const startAt = sessionStorage.getItem('startAt');

  return (
    <Box sx={{ userSelect: 'none' }}>
      <Typography variant='h5' fontWeight={900} sx={{ paddingBottom: 0.5 }}>
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
        <Grid item xs={6} sx={{ padding: '0 0.5rem' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>人數</Box>
          <Box sx={{ fontSize: 'h6.fontSize', fontWeight: 900, color: 'common.black' }}>{people} 位</Box>
        </Grid>
        <Grid item xs={6} sx={{ padding: '0 0.5rem', borderLeft: '1px solid', borderColor: 'common.black_40' }}>
          <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>入座時間</Box>
          <Box sx={{ fontSize: 'h6.fontSize', fontWeight: 900, color: 'common.black' }}>{formatFullDateWithTime(startAt)}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};
