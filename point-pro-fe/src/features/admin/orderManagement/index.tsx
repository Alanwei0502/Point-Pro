import { FC } from 'react';
import { Box } from '@mui/material';
import { PaymentDrawer } from '~/components';
import { OrderTabs } from './OrderTab';
import { OrderList } from './OrderList';
import { CancelOrderConfirmModal } from './modals/CancelOrderConfirmModal';

interface IOrderManagementProps {}

export const OrderManagement: FC<IOrderManagementProps> = () => {
  return (
    <>
      <Box bgcolor={'background.paper'}>
        <OrderTabs />
        <OrderList />
        <PaymentDrawer />
      </Box>
      <CancelOrderConfirmModal />
    </>
  );
};
