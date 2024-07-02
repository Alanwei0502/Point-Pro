import { FC } from 'react';
import Box from '@mui/material/Box';
import { theme } from '~/theme';
import HeaderLogo from '~/assets/images/header-logo.svg';

interface ILoadingMaskProps {}

export const LoadingMask: FC<ILoadingMaskProps> = () => {
  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        zIndex: theme.zIndex.modal + 1,
        position: 'fixed',
        width: '100%',
        height: '100%',
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
    </Box>
  );
};
