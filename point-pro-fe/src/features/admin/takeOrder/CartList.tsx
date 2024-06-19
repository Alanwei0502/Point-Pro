import { FC, useMemo } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { AppButton, headerHeight, Column, Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { theme } from '~/theme';
import { takeOrderSliceActions } from '~/store/slices';
import { CartMeal } from './CartMeal';

interface ICartListProps {}

export const CartList: FC<ICartListProps> = () => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state) => state.takeOrder.cart);

  const hasCartItems = cart.length > 0;

  const totalPrice = useMemo(
    () =>
      cart.reduce((mTotal, m) => {
        const siTotal = m.selectSpecialtyItems.reduce((siTotal, si) => (siTotal += si.price), 0);
        return (mTotal += m.amount * (m.price + siTotal));
      }, 0),
    [cart],
  );

  const handleClickSubmit = () => {
    dispatch(takeOrderSliceActions.openSubmitCartConfirmModal(totalPrice));
  };

  const handleClickClearCart = () => {
    dispatch(takeOrderSliceActions.openClearCartConfirmModal());
  };

  return (
    <Column bgcolor='background.paper' height='100%'>
      <Row justifyContent='space-between' sx={{ padding: '0.5rem' }}>
        <Typography variant='h6' fontWeight={900}>
          已點項目
        </Typography>
        <Box>
          {hasCartItems && (
            <AppButton size='small' variant='text' disableRipple onClick={handleClickClearCart}>
              <Typography component='span' color='common.black' sx={{ textDecorationLine: 'underline', textUnderlineOffset: '0.25rem' }}>
                清空
              </Typography>
            </AppButton>
          )}
        </Box>
      </Row>
      {hasCartItems ? (
        <List
          sx={{
            overflowY: 'auto',
            flexGrow: 1,
            height: `calc(100vh - ${headerHeight} - 16rem)`,
            padding: '.5rem',
          }}
        >
          {cart.map((cartItem, idx) => (
            <ListItem key={`${cartItem.id}-${idx}`} sx={{ padding: 0, margin: '.5rem 0' }}>
              <CartMeal idx={idx} cartItem={cartItem} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant='h5' fontWeight={900} align='center' p={3} m='auto' color={theme.palette.common.black_40}>
          無項目
        </Typography>
      )}
      <Box sx={{ borderTop: `1px dashed ${theme.palette.common.black_60}` }} bgcolor={theme.palette.primary.light}>
        <Column sx={{ padding: '0.5rem', gap: '0.5rem' }}>
          <Row justifyContent='space-between' alignItems='flex-end'>
            <Typography fontWeight={700}>數量</Typography>
            <Typography fontWeight={700}>{cart.reduce((acc, cur) => (acc += cur.amount), 0)}</Typography>
          </Row>
          <Row justifyContent='space-between' alignItems='flex-end'>
            <Typography fontWeight={700}>小計</Typography>
            <Typography fontWeight={700}>{totalPrice}元</Typography>
          </Row>
        </Column>
        <AppButton fullWidth onClick={handleClickSubmit} disabled={!hasCartItems}>
          <Typography fontWeight={700} textAlign='center'>
            送出訂單
          </Typography>
        </AppButton>
      </Box>
    </Column>
  );
};
