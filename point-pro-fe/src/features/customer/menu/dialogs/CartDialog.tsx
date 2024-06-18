import { FC, Fragment, useEffect, useState } from 'react';
import { Box, Divider, List, Typography } from '@mui/material';
import { CartMeal } from '~/features/customer/menu/CartMeal';
import { AppButton, MobileDialogLayout } from '~/components';
import { calculateCartPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDialog, openModal, deleteCartItem, postOrder } from '~/store/slices';
import { MobileModalType, MobileDialog } from '~/types';
import { toast } from 'react-toastify';

interface ICartDialogProps {}

export const CartDialog: FC<ICartDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const meals = useAppSelector((state) => state.menu.meals);
  const cart = useAppSelector((state) => state.menu.cart);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount), 0);
  const totaPrice = calculateCartPrice(cart);

  const handleGoBackToMenu = () => {
    dispatch(closeDialog());
  };

  const handleSubmitOrders = () => {
    setIsSubmitLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(postOrder()).unwrap();
        },
        {
          pending: '送出訂單中...',
          success: '訂單送出成功！',
          error: '訂單送出失敗！',
        },
      )
      .finally(() => {
        setIsSubmitLoading(false);
      });
  };

  useEffect(() => {
    cart.forEach((cartItem, idx) => {
      const meal = meals.find((meal) => meal.id === cartItem.id);
      if (!meal) {
        dispatch(openModal({ type: MobileModalType.CART_ITEM_IS_OFF, data: cartItem }));
        dispatch(deleteCartItem(idx));
      }
    });
  }, [meals, cart, dispatch]);

  return (
    <MobileDialogLayout
      title='購物車'
      titleSize='h4'
      isOpen={dialogType === MobileDialog.CART}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <AppButton fullWidth onClick={handleGoBackToMenu}>
              返回點餐
            </AppButton>
            <AppButton fullWidth onClick={handleSubmitOrders} disabled={cart.length === 0 || isSubmitLoading}>
              送出訂單
            </AppButton>
          </Box>
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
          <Typography sx={{ textAlign: 'center', margin: 'auto', color: 'text.disabled', userSelect: 'none' }}>快去點餐囉！</Typography>
        )}
      </Box>
    </MobileDialogLayout>
  );
};
