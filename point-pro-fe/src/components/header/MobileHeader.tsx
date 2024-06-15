import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, Typography, Link, Box } from '@mui/material';

interface IMobileHeaderProps {}

export const MobileHeader: FC<IMobileHeaderProps> = () => {
  const { pathname } = useLocation();

  return (
    <Box>
      <Breadcrumbs separator='>' sx={{ userSelect: 'none' }}>
        <Link href='/' underline='hover' color='inherit'>
          首頁
        </Link>
        <Typography fontWeight={500} color='common.black'>
          {pathname === '/menu' && '點餐'}
          {pathname === '/booking' && '預約'}
        </Typography>
      </Breadcrumbs>
      <Typography
        variant='h2'
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
    </Box>
  );
};
