import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, List, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { theme } from '~/theme';
import { IOrderMeal, OrderStatus, OrderType, OrdersResult } from '~/types';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { AppButton, Column, Row } from '~/components';
import { formatFullDateWithTime, orderTypeObj } from '~/utils';
import { LinearProgressWithLabel } from './LinearProgressWithLabel';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { OrderMealItem } from './OrderMealItem';
import { orderManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';

const { openCancelOrderConfirmModal, patchOrderMealServedAmount, getOrders } = orderManagementSliceActions;

interface IOrderItemProps {
  order: OrdersResult;
}

export const OrderItem: FC<IOrderItemProps> = (props) => {
  const dispatch = useAppDispatch();

  const { order } = props;

  const typeTab = useAppSelector((state) => state.orderManagement.typeTab);
  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);

  const [expanded, setExpanded] = useState(false);
  const [tempOrder, setTempOrder] = useState(order);
  const [isUpdateServedAmountLoading, setIsUpdateServedAmountLoading] = useState(false);

  const tempServedAmountCompare = useMemo(() => tempOrder.orderMeals.map((m) => m.servedAmount).join(''), [tempOrder.orderMeals]);

  const [totalMeals, servedMeals, servedAmountCompare] = useMemo(
    () =>
      order.orderMeals.reduce(
        (acc, m) => {
          acc[0] = acc[0] + m.amount;
          acc[1] = acc[1] + m.servedAmount;
          acc[2] = `${acc[2]}${m.servedAmount}`;
          return acc;
        },
        [0, 0, ''],
      ),
    [order.orderMeals],
  );

  const progress = (servedMeals / totalMeals) * 100;

  const cancellable = order.status === OrderStatus.WORKING && progress === 0;

  const handleExpand = (event: React.SyntheticEvent<Element, Event>, value: boolean) => {
    setExpanded((prev) => !prev);
  };

  const handleChangeServedAmount = (id: IOrderMeal['id'], newAmount: IOrderMeal['amount']) => {
    setTempOrder((prev) => ({
      ...prev,
      orderMeals: prev.orderMeals.map((m) => ({
        ...m,
        servedAmount: m.id === id ? newAmount : m.servedAmount,
      })),
    }));
  };

  const handleCancelOrder = () => {
    if (!cancellable) return;
    dispatch(openCancelOrderConfirmModal(order));
  };

  const handleUpdateServedAmount = () => {
    setIsUpdateServedAmountLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(
            patchOrderMealServedAmount({
              id: tempOrder.id,
              orderMeals: tempOrder.orderMeals.map((om) => ({
                id: om.id,
                amount: om.amount,
                servedAmount: om.servedAmount,
              })),
            }),
          ).unwrap();
          await dispatch(getOrders({ status: statusTab, type: typeTab }));
        },
        {
          pending: '出餐更新中...',
          success: '更新成功',
          error: '更新失敗',
        },
      )
      .finally(() => {
        setIsUpdateServedAmountLoading(false);
      });
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      sx={{
        bgcolor: 'white',
        boxShadow: `${theme.palette.common.black_40}  0px 1px 2px 0px, ${theme.palette.common.black_40} 0px 2px 6px 2px`,
        margin: '.5rem 0',
      }}
    >
      <AccordionSummary
        sx={{
          flexDirection: 'row-reverse',
          borderBottom: expanded ? `1px solid ${theme.palette.common.black_20}` : null,
          '& > .MuiAccordionSummary-content': { margin: 1 },
        }}
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
      >
        <Row sx={{ width: '100%' }}>
          <Divider orientation='vertical' flexItem variant='middle' sx={{ margin: 2 }} />
          <Column sx={{ flex: '0 70%' }}>
            <Typography fontWeight={700}>{orderTypeObj[order.type]}</Typography>
            {typeTab === OrderType.DINE_IN && (
              <Typography variant='h6' fontWeight={900}>
                {/* {seats.join(', ')} */}
              </Typography>
            )}
          </Column>
          <Divider orientation='vertical' flexItem variant='middle' sx={{ margin: 2 }} />
          <Column sx={{ flex: '0 70%' }}>
            <Typography>訂單編號</Typography>
            <Typography>{order.id.slice(-5)}</Typography>
          </Column>
          <Divider orientation='vertical' flexItem variant='middle' sx={{ margin: 2 }} />
          <Typography sx={{ flex: '0 50%' }}>{formatFullDateWithTime(order.createdAt)}</Typography>
          {statusTab === OrderStatus.WORKING && (
            <>
              <Divider orientation='vertical' flexItem variant='middle' sx={{ margin: 2 }} />
              <Box sx={{ flex: '0 50%' }}>
                <LinearProgressWithLabel value={progress} />
              </Box>
            </>
          )}
        </Row>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: '0.5rem' }}>
        <List disablePadding>
          {tempOrder.orderMeals.map((m, idx) => (
            <OrderMealItem
              idx={idx}
              key={m.id}
              orderMeal={m}
              isUpdateServedAmountLoading={isUpdateServedAmountLoading}
              handleChangeServedAmount={handleChangeServedAmount}
            />
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
          {statusTab === OrderStatus.WORKING && (
            <>
              {cancellable && (
                <AppButton variant='outlined' color='error' onClick={handleCancelOrder} disabled={isUpdateServedAmountLoading}>
                  取消訂單
                </AppButton>
              )}
              <AppButton
                disabled={tempServedAmountCompare === servedAmountCompare}
                loading={isUpdateServedAmountLoading}
                onClick={handleUpdateServedAmount}
              >
                更新出餐
              </AppButton>
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
