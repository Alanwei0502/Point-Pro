import { FC } from 'react';
import { Box } from '@mui/material';
import { OrderTabs } from './OrderTab';
import { OrderList } from './OrderList';
import { CancelOrderConfirmModal } from './modals/CancelOrderConfirmModal';

interface IOrderManagementProps {}

const OrderManagement: FC<IOrderManagementProps> = () => {
  return (
    <>
      <Box bgcolor={'background.paper'}>
        <OrderTabs />
        <OrderList />
      </Box>
      <CancelOrderConfirmModal />
    </>
  );
};

export default OrderManagement;
