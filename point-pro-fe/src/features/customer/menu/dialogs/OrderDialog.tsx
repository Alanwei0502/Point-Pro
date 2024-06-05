import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Divider, Grid, List, ListItem, Tabs, Typography, tabsClasses } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { orderStatusObj, formatFullDateWithTime, calculateOrderPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { setMobileOrderStatusTab, closeDialog, openModal } from '~/store/slices';
import { OrderType, MobileDialog, IOrder, OrderStatus, MobileModal } from '~/types';
import { MobileDialogLayout } from '~/components';
import { StyledTab } from '~/features/customer/menu/CategoryNavbar';

interface IOrdersDialogProps {}

export const OrdersDialog: FC<IOrdersDialogProps> = () => {
  const dispatch = useAppDispatch();
  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const orders = useAppSelector(({ order }) => order.orders);
  const mobileOrderStatusTab = useAppSelector(({ order }) => order.mobileOrderStatusTab);

  const [toggleList, setToggleList] = useState<IOrder['id'][]>([]);
  const [canPay, setCanPay] = useState<boolean>(false);

  const showOrders = orders.filter(({ status }) => status === Object.keys(orderStatusObj)[mobileOrderStatusTab]);

  const totalPrice = useMemo(() => showOrders.reduce((acc, cur) => acc + cur.orderMeals.reduce((acc, cur) => acc + cur.price, 0), 0), [showOrders]);

  useEffect(() => {
    const newOrder = orders[0];
    if (newOrder) {
      setToggleList((prevToggleList) => [...prevToggleList, newOrder.id]);
    }
  }, [orders]);

  useEffect(() => {
    orders.filter(({ status }) => status === OrderStatus.FINISHED).length === showOrders.length ? setCanPay(true) : setCanPay(false);
  }, [orders, showOrders]);

  const handleClose = () => {
    dispatch(closeDialog());
  };

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

  const handleCheckout = () => {
    dispatch(openModal({ type: MobileModal.PAYMENT }));
  };

  return (
    <MobileDialogLayout
      title='訂單'
      titleSize='h2'
      isOpen={dialogType === MobileDialog.ORDER}
      onCloseDialog={handleClose}
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
          {mobileOrderStatusTab === 0 && showOrders.length > 0 && (
            <Button disabled={!canPay} variant='contained' color='primary' onClick={handleCheckout}>
              前往結帳
            </Button>
          )}
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
          {Object.entries(orderStatusObj).map(([orderType, orderTitle], idx) => (
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
                <Box sx={{ width: '100%', borderBottom: '1px solid common.black_60' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ fontWeight: 700 }}>{order.type === OrderType.DINE_IN ? '內用訂單' : '外帶訂單'}</Box>
                    <Box>{formatFullDateWithTime(order.createdAt)}</Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 'body1.fontSize',
                      padding: '.5rem 0',
                    }}
                  >
                    {/* 訂單狀態 */}
                    <Box>
                      <Box component='span' sx={{ color: 'common.black_80' }}>
                        狀態：
                      </Box>
                      <Box component='span' sx={{ fontWeight: 700 }}>
                        {orderStatusObj[order.status]}
                      </Box>
                    </Box>
                    {/* 訂單總金額 */}
                    {order.status !== OrderStatus.CANCEL && <Box sx={{ fontWeight: 700 }}>{calculateOrderPrice(order)}元</Box>}
                  </Box>
                </Box>
                <Divider sx={{ width: '100%', margin: '.5rem 0' }} />
                <Box sx={{ width: '100%', display: toggleList.includes(order.id) ? 'block' : 'none' }}>
                  {order.orderMeals.map((orderMeal) => (
                    <Grid container key={orderMeal.id} sx={{ borderBottom: '1px solid common.black_60' }}>
                      <Grid item xs={1}>
                        {/* 出餐狀態 */}
                        {order.status !== OrderStatus.CANCEL && (
                          <Checkbox checked={orderMeal.amount === orderMeal.servedAmount} size='small' sx={{ padding: 0 }} />
                        )}
                      </Grid>
                      <Grid item sx={{ flexGrow: 1 }} xs={7}>
                        {/* 餐點名稱 */}
                        <Typography sx={{ paddingBottom: '.5rem' }}>{orderMeal.title}</Typography>
                        {/* 客製化項目 */}
                        {orderMeal.specialties.map((s) => (
                          <Box
                            key={s.id}
                            sx={{
                              fontSize: 'small.fontSize',
                              fontWeight: 300,
                              color: 'common.black_60',
                              paddingBottom: '.5rem',
                            }}
                          >
                            {s.title}:
                            <br />
                            {/* {s.map((i) => i.title).join(', ')} */}
                          </Box>
                        ))}
                      </Grid>
                      {/* 數量 */}
                      <Grid item xs={1}>
                        <Box>x{orderMeal.amount}</Box>
                      </Grid>
                      {/* 金額 */}
                      <Grid item sx={{ textAlign: 'right' }} xs={3}>
                        {order.status !== OrderStatus.CANCEL && <Box>{orderMeal.price}元</Box>}
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
                      <Box sx={{ cursor: 'pointer' }}>收合</Box>
                      <ExpandMoreIcon sx={{ rotate: '180deg' }} fontSize='small' />
                    </>
                  ) : (
                    <>
                      <Box sx={{ cursor: 'pointer' }}>點擊查看訂單內容</Box>
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
