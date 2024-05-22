import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography, Link } from '@mui/material';

interface IMobileHeaderProps {}

export const MobileHeader: FC<IMobileHeaderProps> = () => {
  const { pathname } = useLocation();

  return (
    <>
      <Breadcrumbs separator='>' sx={{ userSelect: 'none' }}>
        <Link href='/' underline='hover' color='inherit'>
          首頁
        </Link>
        <Typography fontWeight={500} color='common.black'>
          {pathname === '/take-orders' && '我要點餐'}
          {pathname === '/booking' && '我要預約'}
        </Typography>
      </Breadcrumbs>
      <Typography
        variant='h1'
        fontWeight={900}
        sx={{
          padding: '.5rem 0 1rem',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.paper',
          userSelect: 'none',
        }}
      >
        港都熱炒
      </Typography>
    </>
  );
};
