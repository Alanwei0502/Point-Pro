import { FC, useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, List, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Column, Row } from '~/components';
import { useAppDispatch } from '~/hooks';
import { patchOrder, setCancelOrder } from '~/store/slices';
import { appDayjs, ORDER_TYPE_TRANSLATE } from '~/utils';
import { theme } from '~/theme';
import { OrderStatus, OrderType, IOrder } from '~/types';
import { LinearProgressWithLabel } from './LinearProgressWithLabel';
import { OrderMealItem, VerticalDivider, useAccordion } from './UnpaidAndSuccessOrderItem';

interface IPendingAndCancelOrderItemProps {
  order: IOrder;
}

export const PendingAndCancelOrderItem: FC<IPendingAndCancelOrderItemProps> = (props) => {
  const dispatch = useAppDispatch();
  const { expanded, handleExpand } = useAccordion();
  const { order } = props;

  const { id, status, type, orderMeals, createdAt, seats = [], paymentLogs = [] } = order;
  const [totalMeals, servedMeals] = orderMeals.reduce(
    (acc, meal) => {
      acc[0] = acc[0] + meal.amount;
      acc[1] = acc[1] + meal.servedAmount;
      return acc;
    },
    [0, 0],
  );
  const progress = (servedMeals / totalMeals) * 100;

  const originServedAmount = orderMeals.map((meal) => meal.servedAmount).join('');
  const [tempServedAmount, setUpdatedServedAmount] = useState('');
  const [isServedAmountUpdated, setIsServedAmountUpdated] = useState(false);

  useEffect(() => {
    setUpdatedServedAmount(originServedAmount);
    setIsServedAmountUpdated(false);
  }, [originServedAmount]);

  const handleChangeServedAmount = (idx: number, value: number | string) => {
    const newServedAmount = tempServedAmount.split('');
    newServedAmount[idx] = `${value}`;
    setUpdatedServedAmount(newServedAmount.join(''));
    setIsServedAmountUpdated(originServedAmount !== newServedAmount.join(''));
  };

  const handleCancelOrder = (orderId: string) => {
    dispatch(setCancelOrder(orderId));
  };

  const handleUpdateOrder = () => {
    dispatch(
      patchOrder({
        id,
        status,
        type,
        orderMeals: order.orderMeals.map((meal, idx) => ({
          ...meal,
          servedAmount: +tempServedAmount.split('')[idx],
        })),
        paymentLogs,
      }),
    );
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleExpand}
      sx={{
        bgcolor: 'white',
        boxShadow: `0 0 0.5rem #d1d1d181`,
        '&:before': {
          height: 0,
        },
      }}
    >
      <AccordionSummary
        sx={{
          flexDirection: 'row-reverse',
          borderBottom: expanded ? `1px solid ${theme.palette.common.black_20}` : null,
        }}
        expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}
      >
        <Row sx={{ width: '100%' }}>
          <VerticalDivider />
          <Column sx={{ flex: '0 70%' }}>
            <Typography variant='body1' fontWeight={700}>
              {ORDER_TYPE_TRANSLATE[type]}
            </Typography>
            {type === OrderType.DINE_IN && (
              <Typography variant='h6' fontWeight={900}>
                {seats.join(', ')}
              </Typography>
            )}
          </Column>
          <VerticalDivider />
          <Column sx={{ flex: '0 70%' }}>
            <Typography>訂單編號</Typography>
            <Typography>{id.slice(-5)}</Typography>
          </Column>
          <VerticalDivider />
          <Typography sx={{ flex: '0 50%' }}>{appDayjs(createdAt).format('YYYY/MM/DD HH:mm')}</Typography>
          {status === OrderStatus.WORKING && (
            <>
              <VerticalDivider />
              <Box sx={{ flex: '0 50%' }}>
                <LinearProgressWithLabel value={progress} />
              </Box>
            </>
          )}
        </Row>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: '0 1rem .5rem' }}>
        <List>
          {orderMeals.map((orderMeal, idx) => (
            <OrderMealItem
              idx={idx}
              key={orderMeal.id}
              status={status}
              orderMeal={orderMeal}
              isShowServedAmount={status === OrderStatus.WORKING}
              tempServedAmount={tempServedAmount}
              handleChangeServedAmount={handleChangeServedAmount}
            />
          ))}
        </List>
        <Box sx={{ display: 'flex' }}>
          {status === OrderStatus.WORKING && (
            <>
              {progress === 0 && (
                <Button
                  variant='outlined'
                  color='error'
                  onClick={() => handleCancelOrder(id)}
                  sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700 }}
                >
                  取消訂單
                </Button>
              )}
              <Button
                variant='contained'
                disabled={!isServedAmountUpdated}
                onClick={handleUpdateOrder}
                sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, marginLeft: 'auto' }}
              >
                更新訂單
              </Button>
            </>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
