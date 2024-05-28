import { FC } from 'react';
import { Box } from '@mui/material';
import { PaymentDrawer } from '~/components';
import { OrderTabs } from './OrderTab';
import { OrderList } from './OrderList';

interface IAdminOrdersProps {}

export const AdminOrders: FC<IAdminOrdersProps> = () => {
  return (
    <Box bgcolor={'background.paper'}>
      <OrderTabs />
      <OrderList />
      <PaymentDrawer />
    </Box>
  );
};
