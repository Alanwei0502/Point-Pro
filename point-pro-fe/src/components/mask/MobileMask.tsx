import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { theme } from '~/theme';
import HeaderLogo from '~/assets/images/header-logo.svg';

interface IMobileMaskProps {}

const MobileMask: FC<IMobileMaskProps> = () => {
  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        zIndex: theme.zIndex.modal + 1,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component='img'
        src={HeaderLogo}
        width={100}
        sx={{
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%': {
              transform: 'rotateY(0deg)',
            },
            '100%': {
              transform: 'rotateY(360deg)',
            },
          },
        }}
      />
      <Typography component='p' pt={5}>
        非用餐時段，無法點餐
      </Typography>
    </Box>
  );
};

export default MobileMask;
