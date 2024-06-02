import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useAppSelector } from '~/hooks';
import { formatFullDateWithTime } from '~/utils';

interface ISeatInfoProps {}

export const SeatInfo: FC<ISeatInfoProps> = () => {
  const userInfo = useAppSelector(({ auth }) => auth.userRole);

  return (
    <>
      {userInfo && (
        <Box sx={{ padding: '0 0 1rem', userSelect: 'none' }}>
          <Typography variant='h3' fontWeight={900} sx={{ paddingBottom: '1rem' }}>
            內用資訊
          </Typography>
          <Grid
            container
            sx={{
              padding: '1rem 0',
              borderRadius: '5px',
              bgcolor: 'common.black_20',
              color: 'common.black_60',
            }}
          >
            <Grid item xs={6} sx={{ padding: '0 1rem' }}>
              <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>座位</Box>
              <Box sx={{ fontSize: 'h5.fontSize', fontWeight: 900, color: 'common.black' }}>{userInfo.seatNo}</Box>
            </Grid>
            <Grid item xs={6} sx={{ padding: '0 1rem', borderLeft: '1px solid', borderColor: 'common.black_40' }}>
              <Box sx={{ color: 'common.black_60', fontWeight: 500 }}>入座時間</Box>
              <Box sx={{ fontSize: 'h5.fontSize', fontWeight: 900, color: 'common.black' }}>
                {formatFullDateWithTime(userInfo.startTime)}
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
