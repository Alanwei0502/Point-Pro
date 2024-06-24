import { FC, useState } from 'react';
import { Typography } from '@mui/material';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { orderManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';

const { closeCancelOrderConfirmModal, cancelOrder, getOrders, setSocketOrderPayload } = orderManagementSliceActions;

interface ICancelOrderConfirmModalProps {}

export const CancelOrderConfirmModal: FC<ICancelOrderConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.orderManagement.cancelOrderConfirmModal);
  const typeTab = useAppSelector((state) => state.orderManagement.typeTab);
  const statusTab = useAppSelector((state) => state.orderManagement.statusTab);

  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const handleCancelOrder = () => {
    if (!data) return;

    setIsCancelLoading(true);
    toast
      .promise(
        async () => {
          dispatch(setSocketOrderPayload(data));
          await dispatch(cancelOrder(data)).unwrap();
          await dispatch(getOrders({ status: statusTab, type: typeTab }));
        },
        {
          pending: '取消中...',
          success: '取消成功',
          error: '取消失敗',
        },
      )
      .finally(() => {
        dispatch(closeCancelOrderConfirmModal());
        setIsCancelLoading(false);
      });
  };

  const handleCancel = () => {
    dispatch(closeCancelOrderConfirmModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: `取消「${data?.id.slice(-5)}」訂單`,
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>確定要取消此筆訂單？</Typography>,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleCancelOrder} disabled={isCancelLoading}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
