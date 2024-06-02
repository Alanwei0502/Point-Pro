import { FC } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { BaseButton, headerHeight, Column, Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { theme } from '~/theme';
import { CartMeal } from './CartMeal';
import { takeOrderSlice } from '~/store/slices';

interface ICartListProps {}

export const CartList: FC<ICartListProps> = () => {
  const dispatch = useAppDispatch();

  const { openClearCartConfirmModal, openSubmitCartConfirmModal } = takeOrderSlice.actions;

  const meals = useAppSelector((state) => state.takeOrder.meals);
  const cart = useAppSelector((state) => state.takeOrder.cart);
  const hasCartItems = cart.length > 0;

  const handleClickSubmit = () => {
    dispatch(openSubmitCartConfirmModal());
  };

  const handleClickClearCart = () => {
    dispatch(openClearCartConfirmModal());
  };

  const totalPrice = cart.reduce((mTotal, m) => {
    const siTotal = m.selectSpecialtyItems.reduce((siTotal, si) => (siTotal += si.price), 0);

    return (mTotal += m.amount * (m.price + siTotal));
  }, 0);

  return (
    <Column bgcolor='background.paper' height='100%'>
      {hasCartItems ? (
        <>
          <Row justifyContent='space-between' sx={{ padding: '0.5rem' }}>
            <Typography variant='h5' fontWeight={900}>
              已點項目
            </Typography>
            <Box>
              <BaseButton size={'small'} color='inherit' disableRipple onClick={handleClickClearCart}>
                <Typography
                  component='span'
                  variant='body1'
                  color='common.black'
                  sx={{ textDecorationLine: 'underline', textUnderlineOffset: '0.25rem' }}
                >
                  清空
                </Typography>
              </BaseButton>
            </Box>
          </Row>
          <List
            sx={{
              overflowY: 'auto',
              flexGrow: 1,
              height: `calc(100vh - ${headerHeight} - 16rem)`,
              padding: '.5rem',
            }}
          >
            {cart.map((cartItem, idx) => (
              <ListItem key={`${cartItem.title}-${idx}`} sx={{ padding: 0, margin: '.5rem 0' }}>
                <CartMeal idx={idx} cartItem={cartItem} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }} bgcolor={theme.palette.primary.light}>
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
            <BaseButton sx={{ width: '100%', padding: '1rem', borderRadius: 0 }} variant='contained' onClick={handleClickSubmit} color='primary'>
              <Typography fontWeight={700} textAlign='center'>
                送出訂單
              </Typography>
            </BaseButton>
          </Box>
        </>
      ) : (
        <Typography variant='h5' fontWeight={900} align='center' p={3} sx={{ margin: 'auto' }} color={theme.palette.common.black_40}>
          無項目
        </Typography>
      )}
    </Column>
  );
};
