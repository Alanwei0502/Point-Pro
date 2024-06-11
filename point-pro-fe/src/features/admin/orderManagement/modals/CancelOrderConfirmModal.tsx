import { FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { theme } from '~/theme';
import { orderManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';

const { closeCancelOrderConfirmModal, cancelOrder, getOrders } = orderManagementSliceActions;

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
          await dispatch(cancelOrder(data.id)).unwrap();
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
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title={`取消「${data?.id.slice(-5)}」訂單`} sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', minWidth: '50cqw' }}>
          <Typography textAlign={'center'}>確定要取消此筆訂單？</Typography>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleCancelOrder} disabled={isCancelLoading}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
