import { FC, ReactNode } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { BaseModal } from '~/components';
import { theme } from '~/theme';
import { cancelOrder, setCancelOrder } from '~/store/slices';

interface ITabletModalLayoutProps {
  children: ReactNode;
  open: boolean;
}

export const TabletModalLayout: FC<ITabletModalLayoutProps> = ({ children, open }) => {
  return (
    <BaseModal open={open}>
      <Box display='grid' sx={{ placeContent: 'center' }} height='100%'>
        {children}
      </Box>
    </BaseModal>
  );
};
