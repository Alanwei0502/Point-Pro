import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { OrderType } from '~/types';
import { orderManagementSliceActions } from '~/store/slices/admin/orderManagement.slice';
import { takeOrderSliceActions } from '~/store/slices/admin/takeOrder.slice';
import { paymentSliceActions } from '~/store/slices/admin/payment.slice';

const { postOrder } = orderManagementSliceActions;
const { clearCart, setUnselectMeal } = takeOrderSliceActions;
const { openPaymentModal } = paymentSliceActions;

interface ISubmitCartConfirmModalProps {}

export const SubmitCartConfirmModal: FC<ISubmitCartConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.takeOrder.submitCartConfirmModal.isOpen);
  const cart = useAppSelector((state) => state.takeOrder.cart);
  const totalPrice = useAppSelector((state) => state.takeOrder.totalPrice);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleSubmitOrder = () => {
    setIsSubmitLoading(true);
    toast
      .promise(
        async () => {
          const orderPayload = {
            type: OrderType.TAKE_OUT,
            totalPrice,
            orderMeals: cart.map((m) => {
              return {
                id: m.id,
                amount: m.amount,
                specialtyItems: m.selectSpecialtyItems.map((ssi) => ssi.id),
              };
            }),
          };
          const res = await dispatch(postOrder(orderPayload)).unwrap();
          dispatch(setUnselectMeal());
          dispatch(clearCart());
          if (res.result?.id) {
            dispatch(
              openPaymentModal({
                modalType: 'EDIT',
                data: { type: OrderType.TAKE_OUT, orderId: res.result.id },
              }),
            );
          }
        },
        {
          pending: '送出訂單中...',
          error: '送出訂單失敗',
        },
      )
      .finally(() => {
        dispatch(takeOrderSliceActions.closeSubmitCartConfirmModal());
        setIsSubmitLoading(false);
      });
  };

  const handleCancel = () => {
    dispatch(takeOrderSliceActions.closeSubmitCartConfirmModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '送出訂單',
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>請再次確定訂單內容無誤，即將送出訂單。</Typography>,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleSubmitOrder} disabled={isSubmitLoading}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
