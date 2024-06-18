import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, Divider, Grid, List, ListItem, Tabs, Typography, tabsClasses } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ORDER_STATUS_TRANSLATE, calculateOrderPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setMobileOrderStatusTab, closeDialog, openModal } from '~/store/slices';
import { MobileDialog, IOrder, OrderStatus, MobileModalType } from '~/types';
import { MobileDialogLayout, AppButton } from '~/components';
import { StyledTab } from '~/features/customer/menu/CategoryNavbar';

interface IOrdersDialogProps {}

export const OrdersDialog: FC<IOrdersDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const orders = useAppSelector((state) => state.order.orders);
  const mobileOrderStatusTab = useAppSelector((state) => state.order.mobileOrderStatusTab);

  const [toggleList, setToggleList] = useState<IOrder['id'][]>([]);

  const showOrders = orders.filter(({ status }) => status === Object.keys(ORDER_STATUS_TRANSLATE)[mobileOrderStatusTab]);

  const totalPrice = showOrders.reduce((acc, o) => acc + o.totalPrice, 0);

  const handleClickOrderStatus = (orderStatus: number) => {
    dispatch(setMobileOrderStatusTab(orderStatus));
  };

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

  return (
    <MobileDialogLayout
      title='訂單'
      titleSize='h4'
      isOpen={dialogType === MobileDialog.ORDER}
      actionButton={
        <>
          {mobileOrderStatusTab !== 2 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                userSelect: 'none',
              }}
            >
              <Typography variant='h6' fontWeight={900}>
                總計
              </Typography>
              <Typography variant='h6' fontWeight={900}>
                {totalPrice}元
              </Typography>
            </Box>
          )}
          <AppButton onClick={handleGoBackToMenu}>返回點餐</AppButton>
        </>
      }
    >
      <Box
        sx={{
          position: 'fixed',
          zIndex: 5,
          bgcolor: 'background.paper',
          width: '100%',
          userSelect: 'none',
        }}
      >
        {/* 訂單狀態分類 */}
        <Tabs
          value={mobileOrderStatusTab}
          onChange={(_, value) => handleClickOrderStatus(value)}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              display: 'none',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            marginBottom: '10px',
          }}
        >
          {Object.entries(ORDER_STATUS_TRANSLATE).map(([orderType, orderTitle], idx) => (
            <StyledTab key={`${orderTitle}-${idx}`} value={idx} label={orderTitle} />
          ))}
        </Tabs>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '4rem',
          paddingBottom: '10rem',
          userSelect: 'none',
        }}
      >
        {/* 訂單記錄 */}
        {showOrders.length > 0 ? (
          <List>
            {showOrders.map((order, idx) => (
              <ListItem
                key={`${order.id}-${idx}`}
                sx={{
                  bgcolor: 'common.white',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '.5rem',
                  borderRadius: '.5rem',
                  marginBottom: '1rem',
                  border: '1px solid',
                  borderColor: 'common.black_40',
                }}
                onClick={handleToggleListItem(order.id)}
              >
                <Box
                  sx={{
                    width: '100%',
                    borderBottom: '1px solid common.black_60',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* 訂單狀態 */}
                  <Typography color='common.black_80'>
                    狀態：
                    <Typography component='span'>{ORDER_STATUS_TRANSLATE[order.status]}</Typography>
                  </Typography>

                  {/* 訂單總金額 */}
                  {order.status !== OrderStatus.CANCEL && <Box fontWeight={700}>{order.totalPrice}元</Box>}
                </Box>
                <Divider sx={{ width: '100%', margin: '.5rem 0' }} />
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
                        <Grid container>
                          <Grid item sx={{ flexGrow: 1 }} xs={7}>
                            {/* 餐點名稱 */}
                            <Typography sx={{ paddingBottom: '.5rem' }} fontWeight={700}>
                              {orderMeal.meals.title}
                            </Typography>
                          </Grid>
                          {/* 數量 */}
                          <Grid item xs={1}>
                            <Box>x{orderMeal.amount}</Box>
                          </Grid>
                          {/* 金額 */}
                          <Grid item sx={{ textAlign: 'right' }} xs={3}>
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
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 'small.fontSize',
                    fontWeight: 700,
                    width: '100%',
                  }}
                >
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
