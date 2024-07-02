import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { appDayjs } from '~/utils';

interface IFooterProps {}

export const Footer: FC<IFooterProps> = () => {
  return (
    <Box bgcolor='common.black' py={3}>
      <Typography variant='small' color='white' align='center'>
        © {appDayjs().year()} PointPro. 版權所有。保留一切權利。
      </Typography>
    </Box>
  );
};
