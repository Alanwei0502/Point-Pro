import { FC, PropsWithChildren } from 'react';
import { Box } from '@mui/material';

export const MobileLayout: FC<PropsWithChildren> = (props) => {
  return (
    <Box
      sx={{
        width: '100vw',
        maxWidth: '768px',
        minHeight: '100vh',
        padding: '.5rem',
        bgcolor: 'background.paper',
        margin: 'auto',
      }}
    >
      {props.children}
    </Box>
  );
};
