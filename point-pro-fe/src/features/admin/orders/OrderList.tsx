import { FC, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { getOrders } from '~/store/slices';
import { OrderStatus, GatherOrder } from '~/types';
import { headerHeight, Column, CancelOrderConfirmModal } from '~/components';
import { PendingAndCancelOrderItem, UnpaidAndSuccessOrderItem } from './OrderItem';

export const OrderList: FC = () => {
  const dispatch = useAppDispatch();

  const tabStatus = useAppSelector(({ order }) => order.status);
  const orders = useAppSelector(({ order }) => order.orders);

  const gatherOrders = () => {
    const showNewOrders: GatherOrder[] = [];

    orders.forEach((order) => {
      const { id, status, type, seats = [], paymentLogs, reservationId } = order;
      const gatherOrder: GatherOrder = { id, status, type, seats, paymentLogs, orders: [order], reservationId };

      if (reservationId) {
        // 內用單
        const sameGroupOrderIndex = showNewOrders.findIndex((item) => item.reservationId === reservationId);

        if (sameGroupOrderIndex === -1 && !showNewOrders[sameGroupOrderIndex]) {
          showNewOrders.push(gatherOrder);
        } else {
          (showNewOrders[sameGroupOrderIndex] as GatherOrder).orders.push(order);
        }
      } else {
        // 外帶單
        showNewOrders.push(gatherOrder);
      }
    });
    return showNewOrders;
  };

  const isPendingOrCancelOrder = tabStatus === OrderStatus.WORKING || tabStatus === OrderStatus.CANCEL;
  const isShowOrders = (isPendingOrCancelOrder ? orders.length : gatherOrders().length) > 0;

  useEffect(() => {
    dispatch(getOrders({ status: tabStatus }));
  }, [dispatch, tabStatus]);

  return (
    <>
      {isShowOrders ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '0.75rem',
            height: `calc(100vh - ${headerHeight} - 54px)`,
            userSelect: 'none',
          }}
        >
          {isPendingOrCancelOrder
            ? // 準備中、已取消
              orders.map((order) => <PendingAndCancelOrderItem key={order.id} order={order} />)
            : // 未付款、已付款
              gatherOrders().map((order) => <UnpaidAndSuccessOrderItem key={order.id} gatherOrder={order} />)}
        </Box>
      ) : (
        <Column
          justifyContent='center'
          bgcolor='background.paper'
          height={`calc(100vh - ${headerHeight} - 54px)`}
          sx={{
            userSelect: 'none',
          }}
        >
          <Typography variant='h4' textAlign='center' color='text.disabled'>
            無此分類訂單
          </Typography>
        </Column>
      )}
      <CancelOrderConfirmModal />
    </>
  );
};
