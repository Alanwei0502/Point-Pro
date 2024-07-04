import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { CartMeal } from '~/features/customer/menu/CartMeal';
import { AppButton, MobileDialogLayout } from '~/components';
import { calculateCartPrice } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { MobileModalType, MobileDialog } from '~/types';
import { menuSliceActions } from '~/store/slices/customer/menu.slice';
import { orderSliceActions } from '~/store/slices/customer/order.slice';

const { postOrder } = orderSliceActions;
const { closeDialog, openModal, deleteCartItem, openDialog, clearCart } = menuSliceActions;

interface ICartDialogProps {}

export const CartDialog: FC<ICartDialogProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const meals = useAppSelector((state) => state.menu.meals);
  const cart = useAppSelector((state) => state.menu.cart);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const totalAmount = cart.reduce((acc, cur) => (acc += cur.amount), 0);
  const totaPrice = calculateCartPrice(cart);
  const isCartEmpty = totalAmount <= 0;
  const enableSubmit = !isCartEmpty && !isSubmitLoading;

  const handleGoBackToMenu = () => {
    dispatch(closeDialog());
  };

  const handleSubmitOrders = () => {
    setIsSubmitLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(postOrder()).unwrap();
          dispatch(openDialog({ type: MobileDialog.ORDER }));
          dispatch(clearCart());
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
          <Box display='flex' flexDirection='column' width='100%' sx={{ userSelect: 'none' }}>
            <Box display='flex' justifyContent='space-between'>
              <Typography fontWeight={700}>數量</Typography>
              <Typography fontWeight={700}>共 {totalAmount} 份餐點</Typography>
            </Box>
            <Box display='flex' justifyContent='space-between'>
              <Typography fontWeight={700}>小計</Typography>
              <Typography fontWeight={700}>{totaPrice}元</Typography>
            </Box>
          </Box>
          <Box display='flex' alignItems='center' gap={2} width='100%'>
            <AppButton fullWidth onClick={handleGoBackToMenu}>
              返回
            </AppButton>
            <AppButton fullWidth onClick={handleSubmitOrders} disabled={!enableSubmit}>
              送出訂單
            </AppButton>
          </Box>
        </>
      }
    >
      <Box display='flex' flexDirection='column' flexGrow={1} sx={{ userSelect: 'none' }}>
        {isCartEmpty ? (
          <Typography textAlign='center' m='auto' color='text.disabled' sx={{ userSelect: 'none' }}>
            快去點餐囉！
          </Typography>
        ) : (
          <List>
            {cart.map((cartItem, idx) => (
              <CartMeal cartItem={cartItem} idx={idx} key={`${cartItem.id}-${idx}`} />
            ))}
          </List>
        )}
      </Box>
    </MobileDialogLayout>
  );
};
