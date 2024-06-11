import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Typography, Box, TablePagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { orderManagementSliceActions } from '~/store/slices';
import { OrderStatus } from '~/types';
import { headerHeight, Column } from '~/components';
import { OrderItem } from './OrderItem';

const { getOrders } = orderManagementSliceActions;
const defaultPage = 0;
const defaultRowsPerPage = 20;

interface IOrderList {}

export const OrderList: FC<IOrderList> = () => {
  const dispatch = useAppDispatch();

  const typeTab = useAppSelector((state) => state.orderManagement.typeTab);
  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);
  const workingOrders = useAppSelector((state) => state.orderManagement.workingOrders);
  const finishedOrders = useAppSelector((state) => state.orderManagement.finishedOrders);
  const cancelOrders = useAppSelector((state) => state.orderManagement.cancelOrders);

  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  useEffect(() => {
    dispatch(getOrders({ status: statusTab, type: typeTab }));
    setPage(defaultPage);
    setRowsPerPage(defaultRowsPerPage);
  }, [dispatch, statusTab, typeTab]);

  const statusListObj = {
    [OrderStatus.WORKING]: workingOrders,
    [OrderStatus.FINISHED]: finishedOrders,
    [OrderStatus.CANCEL]: cancelOrders,
  };

  const totalList = statusListObj[statusTab].filter((o) => o.type === typeTab);

  const showList = totalList.filter((_, i) => i >= page * rowsPerPage && i < (page + 1) * rowsPerPage);

  const isEmpty = totalList.length === 0;

  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(defaultPage);
    setRowsPerPage(parseInt(e.target.value, 10));
  };

  // const gatherOrders = () => {
  //   const showNewOrders: GatherOrder[] = [];

  //   orders.forEach((order) => {
  //     const { id, status, type, seats = [], paymentLogs, reservationId } = order;
  //     const gatherOrder: GatherOrder = { id, status, type, seats, paymentLogs, orders: [order], reservationId };

  //     if (reservationId) {
  //       // 內用單
  //       const sameGroupOrderIndex = showNewOrders.findIndex((item) => item.reservationId === reservationId);

  //       if (sameGroupOrderIndex === -1 && !showNewOrders[sameGroupOrderIndex]) {
  //         showNewOrders.push(gatherOrder);
  //       } else {
  //         (showNewOrders[sameGroupOrderIndex] as GatherOrder).orders.push(order);
  //       }
  //     } else {
  //       // 外帶單
  //       showNewOrders.push(gatherOrder);
  //     }
  //   });
  //   return showNewOrders;
  // };

  // const isPendingOrCancelOrder = statusTab === OrderStatus.WORKING || statusTab === OrderStatus.CANCEL;
  // const isEmpty = (isPendingOrCancelOrder ? orders.length : gatherOrders().length) > 0;

  // useEffect(() => {
  //   dispatch(getOrders({ status: statusTab }));
  // }, [dispatch, statusTab]);

  if (isEmpty) {
    return (
      <Column justifyContent='center' bgcolor='background.paper' height={`calc(100vh - ${headerHeight} - 54px)`} sx={{ userSelect: 'none' }}>
        <Typography variant='h4' textAlign='center' color='text.disabled'>
          無訂單
        </Typography>
      </Column>
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: '0.75rem',
          height: `calc(100vh - ${headerHeight} - 48px - 55px)`,
          userSelect: 'none',
          overflow: 'scroll',
        }}
      >
        {showList.map((o) => (
          <OrderItem key={o.id} order={o} />
        ))}
        {/* {
            isPendingOrCancelOrder && // 準備中、已取消
              showList.map((order) => <PendingAndCancelOrderItem key={order.id} order={order} />)
             : // 未付款、已付款
             gatherOrders().map((order) => <UnpaidAndSuccessOrderItem key={order.id} gatherOrder={order} />)
          } */}
      </Box>
      <TablePagination
        component='div'
        count={totalList.length}
        page={page}
        labelDisplayedRows={({ page, count }) => `第 ${page + 1} 頁，共 ${count} 筆`}
        labelRowsPerPage='每頁顯示'
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};
