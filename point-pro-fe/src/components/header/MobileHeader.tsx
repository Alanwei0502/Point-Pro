import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { ROUTE_PATH } from '~/utils';

interface IMobileHeaderProps {}

export const MobileHeader: FC<IMobileHeaderProps> = () => {
  const { pathname } = useLocation();

  return (
    <Box>
      <Breadcrumbs separator='>' sx={{ userSelect: 'none' }}>
        <Link href='/' underline='hover' color='inherit'>
          首頁
        </Link>
        <Typography fontWeight={500} color='common.black' sx={{ textDecoration: 'underline' }}>
          {pathname.includes(ROUTE_PATH.menu) && '點餐'}
          {pathname.includes(ROUTE_PATH.booking) && '預約'}
        </Typography>
      </Breadcrumbs>
      <Typography
        variant='h4'
        fontWeight={900}
        sx={{
          padding: '.5rem 0',
          userSelect: 'none',
        }}
      >
        港都熱炒
      </Typography>
    </Box>
  );
};
