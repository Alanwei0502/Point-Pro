import { FC, Fragment, useEffect } from 'react';
import { Box, Button, Divider, List, Typography } from '@mui/material';
import { CartMeal } from '~/features/customer/takeOrders/CartMeal';
import { MobileDialogLayout } from '~/components';
import { calculateCartPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { postOrder, closeDialog, openModal, deleteCartItem } from '~/store/slices';
import { MobileModal, MobileDialog } from '~/types';

interface ICartDialogProps {}

export const CartDialog: FC<ICartDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector(({ takeOrder }) => takeOrder.dialog.type);
  const meals = useAppSelector(({ takeOrder }) => takeOrder.meals);
  const cart = useAppSelector(({ takeOrder }) => takeOrder.cart);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount), 0);
  const totaPrice = calculateCartPrice(cart);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const handleSubmitOrders = () => {
    dispatch(postOrder({ isCustomer: true }));
  };

  useEffect(() => {
    cart.forEach((cartItem, idx) => {
      const meal = meals.find((meal) => meal.id === cartItem.id);
      if (!meal) {
        dispatch(openModal({ type: MobileModal.CART_ITEM_IS_OFF, data: cartItem }));
        dispatch(deleteCartItem(idx));
      }
    });
  }, [meals, cart, dispatch]);

  return (
    <MobileDialogLayout
      title='購物車'
      titleSize='h2'
      isOpen={dialogType === MobileDialog.CART}
      onCloseDialog={handleClose}
      actionButton={
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='h6' fontWeight={900}>
                數量
              </Typography>
              <Typography variant='h6' fontWeight={900}>
                {totalAmount}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='h6' fontWeight={900}>
                小計
              </Typography>
              <Typography variant='h6' fontWeight={900}>
                {totaPrice}元
              </Typography>
            </Box>
          </Box>
          <Button onClick={handleSubmitOrders} disabled={cart.length === 0}>
            送出訂單
          </Button>
        </>
      }
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', userSelect: 'none' }}>
        {cart.length > 0 ? (
          <List>
            {cart.map((cartItem, idx) => (
              <Fragment key={`${cartItem.id}-${idx}`}>
                <CartMeal cartItem={cartItem} idx={idx} />
                <Divider />
              </Fragment>
            ))}
          </List>
        ) : (
          <Typography sx={{ textAlign: 'center', margin: 'auto', color: 'text.disabled', userSelect: 'none' }}>
            快去點餐囉！
          </Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};
