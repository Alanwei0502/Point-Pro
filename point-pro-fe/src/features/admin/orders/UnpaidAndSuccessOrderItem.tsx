import { FC, useCallback, useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, List, ListItem, Box, Select, MenuItem, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Column, Row } from '~/components';
import { useAppDispatch } from '~/hooks';
import { patchOrder, setCancelOrder, openPaymentDrawer } from '~/store/slices';
import { appDayjs, calculateOrderPrice, calculateGatherOrderPrice, orderTypeObj } from '~/utils';
import { theme } from '~/theme';
import { OrderStatus, OrderType, GatherOrder, IOrder, IOrderMeal } from '~/types';
import { LinearProgressWithLabel } from './LinearProgressWithLabel';

export function useAccordion() {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setExpanded((prevExpand) => !prevExpand);
  }, []);

  return { expanded, handleExpand };
}

export const VerticalDivider = styled('div')(({ theme }) => ({
  height: '32px',
  width: '1px',
  background: theme.palette.common.black_40,
  margin: '0 1rem',
}));

interface IUnpaidAndSuccessOrderItemProps {
  gatherOrder: GatherOrder;
}
export const UnpaidAndSuccessOrderItem: FC<IUnpaidAndSuccessOrderItemProps> = (props) => {
  const { gatherOrder } = props;
  const { id, type, status, seats = [], orders = [], paymentLogs = [] } = gatherOrder;
  const totalPrice = calculateGatherOrderPrice(gatherOrder);

  const dispatch = useAppDispatch();
  const { expanded, handleExpand } = useAccordion();

  const handlePayment = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      dispatch(openPaymentDrawer(gatherOrder));
    },
    [dispatch, gatherOrder],
  );

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
          <Column sx={{ flexGrow: 1 }}>
            <Typography variant='body1' fontWeight={700}>
              {orderTypeObj[type]}
            </Typography>
            {type === OrderType.DINE_IN && (
              <Typography variant='h6' fontWeight={900}>
                {seats.join(', ')}
              </Typography>
            )}
          </Column>
          {type === OrderType.TAKE_OUT && (
            <>
              <VerticalDivider />
              <Column sx={{ flexGrow: 1 }}>
                <Typography>訂單編號</Typography>
                <Typography>{id.slice(-5)}</Typography>
              </Column>
              {status === OrderStatus.FINISHED && (
                <>
                  <VerticalDivider />
                  <Column sx={{ minWidth: '13rem' }}>
                    <Typography fontWeight={700}>付款方式：{paymentLogs?.[0].gateway ?? null}</Typography>
                  </Column>
                </>
              )}
            </>
          )}
          <VerticalDivider />
          <Column sx={{ minWidth: '13rem', textAlign: 'right' }}>
            <Typography variant='h6' fontWeight={700}>
              總金額：{totalPrice}元
            </Typography>
          </Column>
          {status === OrderStatus.FINISHED && (
            <>
              <VerticalDivider />
              <Button variant='contained' onClick={handlePayment} sx={{ fontSize: theme.typography.body1.fontSize, fontWeight: 700, height: '100%' }}>
                收款
              </Button>
            </>
          )}
        </Row>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: '0 1rem .5rem' }}>
        {orders.map((order) => (
          <Box key={order.id} sx={{ margin: '1rem 0' }}>
            <Accordion
              sx={{
                boxShadow: `0 0 0.25rem #b8b8b881`,
              }}
            >
              {type === OrderType.DINE_IN && (
                <AccordionSummary>
                  <Row sx={{ width: '100%' }}>
                    <Column sx={{ flexGrow: 1 }}>
                      <Typography>訂單編號</Typography>
                      <Typography>{order.id.slice(-5)}</Typography>
                    </Column>
                    <VerticalDivider />
                    <Typography sx={{ minWidth: '13rem' }}>{appDayjs(order.createdAt).format('YYYY/MM/DD HH:mm')}</Typography>
                    {status === OrderStatus.FINISHED && (
                      <>
                        <VerticalDivider />
                        <Column sx={{ minWidth: '13rem' }}>
                          <Typography fontWeight={700}>付款方式：{order.paymentLogs[0]?.gateway ?? null}</Typography>
                        </Column>
                      </>
                    )}
                    <VerticalDivider />
                    <Column sx={{ minWidth: '12rem', textAlign: 'right' }}>
                      <Typography fontWeight={700}>金額：{calculateOrderPrice(order)}元</Typography>
                    </Column>
                  </Row>
                </AccordionSummary>
              )}
              <AccordionDetails sx={{ bgcolor: theme.palette.secondary.contrastText }}>
                <List>
                  {order.orderMeals.map((orderMeal, idx) => (
                    <OrderMealItem idx={idx} key={orderMeal.id} status={status} orderMeal={orderMeal} />
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};
