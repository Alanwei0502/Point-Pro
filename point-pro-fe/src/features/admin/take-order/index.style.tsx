import { FC, useEffect, useState } from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';
import { BaseButton, ClearCartConfirmModal, SubmitOrderConfirmModal, headerHeight, Column, Row } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { deleteCartItem } from '~/store/slices/customer/takeOrder.slice';
import { theme } from '~/theme';
import { calculateCartPrice } from '~/utils';
import { CartMeal } from './CartMeal';

interface ICartListProps {}

export const CartList: FC<ICartListProps> = () => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);
  const hasCartItems = cart.length > 0;
  const [openClearCartConfirmModal, setOpenClearCartConfirmModal] = useState(false);
  const [openSubmitOrderConfirmModal, setOpenSubmitOrderConfirmModal] = useState(false);

  const handleSubmitOrders = () => {
    setOpenSubmitOrderConfirmModal(true);
  };

  const totalPrice = calculateCartPrice(cart);

  useEffect(() => {
    cart.forEach((cartItem, idx) => {
      const meal = meals.find((meal) => meal.id === cartItem.id);
      if (!meal) {
        dispatch(deleteCartItem(idx));
      }
    });
  }, [cart, dispatch, meals]);

  // [TODO] cart item remove reminder

  return (
    <>
      <Column bgcolor='background.paper' height='100%'>
        {hasCartItems ? (
          <>
            <Row justifyContent='space-between' sx={{ padding: '0.5rem' }}>
              <Typography variant='h5' fontWeight={900}>
                已點項目
              </Typography>
              <Box>
                <BaseButton size={'small'} color='inherit' disableRipple onClick={() => setOpenClearCartConfirmModal(true)}>
                  <Typography
                    component='span'
                    variant='body1'
                    color='common.black'
                    sx={{ textDecorationLine: 'underline', textUnderlineOffset: '0.25rem' }}
                  >
                    清空購物車
                  </Typography>
                </BaseButton>
              </Box>
            </Row>
            {/* 購物車項目 */}
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
            <Box sx={{ borderTop: `1px dashed ${theme.palette.common.black_40}` }} bgcolor={'background.paper'}>
              <Column sx={{ padding: '0.75rem 1.5rem', gap: '0.75rem' }}>
                <Row justifyContent={'space-between'} alignItems={'flex-end'}>
                  <Typography variant='body1' fontWeight={700}>
                    數量
                  </Typography>
                  <Typography variant='h6' fontWeight={900}>
                    {cart.reduce((acc, cur) => (acc += cur.amount), 0)}
                  </Typography>
                </Row>
                <Row justifyContent='space-between' alignItems='flex-end'>
                  <Typography variant='body1' fontWeight={700}>
                    小計
                  </Typography>
                  <Typography variant='h6' fontWeight={900}>
                    {totalPrice}元
                  </Typography>
                </Row>
              </Column>
              <BaseButton
                sx={{ width: '100%', padding: '1rem', borderRadius: 0, boxShadow: 'none' }}
                variant='contained'
                onClick={handleSubmitOrders}
                color='primary'
              >
                <Typography variant='h6' fontWeight={900} textAlign='center'>
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
      <ClearCartConfirmModal open={openClearCartConfirmModal} setOpen={setOpenClearCartConfirmModal} />
      <SubmitOrderConfirmModal open={openSubmitOrderConfirmModal} setOpen={setOpenSubmitOrderConfirmModal} />
    </>
  );
};
