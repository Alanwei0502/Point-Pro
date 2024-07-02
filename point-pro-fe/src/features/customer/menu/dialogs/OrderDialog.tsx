import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ORDER_STATUS_TRANSLATE, calculateOrderPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, orderSliceActions } from '~/store/slices';
import { MobileDialog, IOrder, OrderStatus } from '~/types';
import { MobileDialogLayout, AppButton } from '~/components';

const { getOrders } = orderSliceActions;

interface IOrdersDialogProps {}

export const OrdersDialog: FC<IOrdersDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const orders = useAppSelector((state) => state.order.orders);

  const [toggleList, setToggleList] = useState<IOrder['id'][]>([]);

  const totalPrice = orders.filter((o) => o.status !== OrderStatus.CANCEL).reduce((acc, o) => acc + o.totalPrice, 0);

  const handleToggleListItem = (orderId: IOrder['id']) => () => {
    let newToggleList: IOrder['id'][];
    if (toggleList.includes(orderId)) {
      newToggleList = toggleList.filter((id) => id !== orderId);
    } else {
      newToggleList = [...toggleList, orderId];
    }
    setToggleList(newToggleList);
  };

  const handleGoBackToMenu = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    const newOrder = orders[0];
    if (newOrder) {
      setToggleList((prevToggleList) => [...prevToggleList, newOrder.id]);
    }
  }, [orders]);

  useEffect(() => {
    if (dialogType === MobileDialog.ORDER) {
      dispatch(getOrders());
    }
  }, [dialogType, dispatch]);

  return (
    <MobileDialogLayout
      title='點餐紀錄'
      titleSize='h4'
      isOpen={dialogType === MobileDialog.ORDER}
      actionButton={
        <>
          <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' sx={{ userSelect: 'none' }}>
            <Typography fontWeight={700}>總計</Typography>
            <Typography fontWeight={700}>{totalPrice}元</Typography>
          </Box>
          <AppButton size='small' onClick={handleGoBackToMenu}>
            返回
          </AppButton>
        </>
      }
    >
      <Box display='flex' flexDirection='column' flexGrow={1} pb='10rem' sx={{ userSelect: 'none' }}>
        {/* 訂單記錄 */}
        {orders.length > 0 ? (
          <List>
            {orders.map((order, idx) => (
              <ListItem
                key={order.id}
                sx={{
                  bgcolor: 'common.white',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '.5rem',
                  borderRadius: '.5rem',
                  marginBottom: '1rem',
                  border: '1px solid',
                  borderColor: 'common.black_40',
                  cursor: 'pointer',
                }}
                onClick={handleToggleListItem(order.id)}
              >
                <Box width='100%' display='flex' justifyContent='space-between' alignItems='center' pb={2}>
                  {/* 訂單狀態 */}
                  <Typography color='common.black_80'>
                    狀態：
                    <Typography component='span'>{ORDER_STATUS_TRANSLATE[order.status]}</Typography>
                  </Typography>

                  {/* 訂單總金額 */}
                  <Box fontWeight={700}>{order.totalPrice}元</Box>
                </Box>
                <Box display={toggleList.includes(order.id) ? 'block' : 'none'} width='100%'>
                  {order.orderMeals.map((orderMeal) => (
                    <Grid container key={orderMeal.id}>
                      <Grid item xs={1}>
                        {/* 出餐狀態 */}
                        {order.status !== OrderStatus.CANCEL && (
                          <Checkbox checked={orderMeal.amount === orderMeal.servedAmount} size='small' sx={{ padding: 0 }} />
                        )}
                      </Grid>
                      <Grid item xs={11}>
                        <Grid container flexWrap='nowrap'>
                          <Grid item sx={{ flexGrow: 1 }} flexGrow={2}>
                            {/* 餐點名稱 */}
                            <Typography sx={{ paddingBottom: '.5rem' }} fontWeight={700}>
                              {orderMeal.meals.title}
                            </Typography>
                          </Grid>
                          {/* 數量 */}
                          <Grid item minWidth={50}>
                            <Box>{orderMeal.amount} 份</Box>
                          </Grid>
                          {/* 金額 */}
                          <Grid item textAlign='right' minWidth={80}>
                            {order.status !== OrderStatus.CANCEL && <Box>{calculateOrderPrice(orderMeal)}元</Box>}
                          </Grid>
                        </Grid>
                        {/* 客製化項目 */}
                        <Grid item fontSize='small.fontSize' fontWeight={300} color='common.black_60' paddingBottom='.5rem' width='100%'>
                          {orderMeal.orderMealSpecialtyItems.map((s) => s.specialtyItems.title).join(', ')}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
                <Box display='flex' justifyContent='center' alignItems='center' fontSize='small.fontSize' fontWeight={700} width='100%'>
                  {toggleList.includes(order.id) ? (
                    <>
                      <Box sx={{ cursor: 'pointer' }}>點擊收合</Box>
                      <ExpandMoreIcon sx={{ rotate: '180deg' }} fontSize='small' />
                    </>
                  ) : (
                    <>
                      <Box sx={{ cursor: 'pointer' }}>點擊查看</Box>
                      <ExpandMoreIcon fontSize='small' />
                    </>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: 'center', margin: 'auto', color: 'text.disabled' }}>沒有訂單記錄</Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};
