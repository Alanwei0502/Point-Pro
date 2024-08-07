import { FC } from 'react';
import Typography from '@mui/material/Typography';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { paymentSliceActions } from '~/store/slices/admin/payment.slice';
import { PaymentStatus } from '~/types';
import { TabletModal } from './TabletModal';
import { AppButton } from '../button/AppButton';

const { closePaymentModal, patchPaymentStatus, closeLinePayModal, closeConfirmCloseLinePayModal } = paymentSliceActions;

interface IConfirmCloseLinePayModalProps {}

export const ConfirmCloseLinePayModal: FC<IConfirmCloseLinePayModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.payment.confirmCloseLinePayModal.isOpen);
  const data = useAppSelector((state) => state.payment.linePayModal.data);

  const handleCancel = () => {
    dispatch(closeConfirmCloseLinePayModal());
  };

  const handleConfirm = () => {
    if (!data?.result?.paymentId) return;
    dispatch(patchPaymentStatus({ id: data.result.paymentId, status: PaymentStatus.CANCEL }));
    dispatch(closePaymentModal());
    dispatch(closeLinePayModal());
    dispatch(closeConfirmCloseLinePayModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '關閉 Line Pay 付款視窗',
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>請再次確認已經完成付款才關閉視窗。</Typography>,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirm}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
