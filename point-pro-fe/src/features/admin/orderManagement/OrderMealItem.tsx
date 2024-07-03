import { FC } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Row } from '~/components';
import { theme } from '~/theme';
import { OrderStatus, OrderMealInOrdersResult, IOrderMeal } from '~/types';
import { useAppSelector } from '~/hooks';

interface IOrderMealItemProps {
  idx: number;
  orderMeal: OrderMealInOrdersResult;
  isUpdateServedAmountLoading: boolean;
  handleChangeServedAmount: (id: IOrderMeal['id'], newAmount: IOrderMeal['amount']) => void;
}
export const OrderMealItem: FC<IOrderMealItemProps> = (props) => {
  const { orderMeal, idx, handleChangeServedAmount, isUpdateServedAmountLoading } = props;

  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);

  const orderMealTotalPrice =
    (orderMeal.meals.price + orderMeal.orderMealSpecialtyItems.reduce((acc, osi) => (acc += osi.specialtyItems.price), 0)) * orderMeal.amount;

  const handleChangeServedAmoount = (e: SelectChangeEvent<string>) => {
    handleChangeServedAmount(orderMeal.id, Number(e.target.value));
  };

  return (
    <ListItem
      sx={{
        borderTop: idx > 0 ? `1px solid ${theme.palette.common.black_20}` : 'none',
        padding: 0,
      }}
    >
      <Row justifyContent='space-between' width='100%' gap={2} sx={{ padding: 1 }}>
        <Typography sx={{ minWidth: '12rem', fontWeight: 700 }}>{orderMeal.meals.title}</Typography>
        <Typography sx={{ minWidth: '5rem' }}>{orderMeal.meals.price}元</Typography>
        <List sx={{ margin: 0, padding: 0, flexGrow: 1, fontSize: 16 }}>
          {orderMeal.orderMealSpecialtyItems.map((si) => si.specialtyItems.title).join('、') || (
            <Typography color={theme.palette.common.black_40}>無客製化</Typography>
          )}
        </List>
        <Typography sx={{ minWidth: '3rem', fontWeight: 700 }}>x {orderMeal.amount}</Typography>
        {statusTab === OrderStatus.WORKING && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '8rem',
              gap: '.5rem',
            }}
          >
            <Typography whiteSpace='nowrap'>已出餐</Typography>
            <Select
              value={`${orderMeal.servedAmount}`}
              disabled={isUpdateServedAmountLoading}
              onChange={handleChangeServedAmoount}
              sx={{ width: '80%', height: '2rem' }}
            >
              {Array.from({ length: orderMeal.amount + 1 }, (_, i) => i).map((amount) => (
                <MenuItem key={`${orderMeal.id}-${amount}`} value={`${amount}`}>
                  {amount}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
        <Typography fontWeight={700} sx={{ width: '5rem', textAlign: 'right' }}>
          {orderMealTotalPrice}元
        </Typography>
      </Row>
    </ListItem>
  );
};
