import { FC, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import MoneyIcon from '@mui/icons-material/Money';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { openModal } from '~/store/slices/customer/menu.slice';
import linePay from '~/assets/images/line-pay.png';
import { requestEcPay, requestLinePay } from '~/store/slices';
import { MobileModalType, OrderStatus } from '~/types';
import { MobileModal } from '~/components';

interface IPaymentModalProps {}

export const PaymentModal: FC<IPaymentModalProps> = () => {
  const dispatch = useAppDispatch();

  const { type: modalType } = useAppSelector((state) => state.menu.modal);
  const orders = useAppSelector(({ order }) => order.orders);
  const linePayResponse = useAppSelector(({ payment }) => payment.linePayResponse);

  const handlePaymentByCash = () => {
    dispatch(openModal({ type: MobileModalType.COUNTER_REMINDER }));
  };

  const handlePaymentByCard = async () => {
    // [TODO]: jump to NewebPay
    const orderIds = orders.filter((order) => order.status === OrderStatus.FINISHED).map((order) => order.id);
    await dispatch(
      requestEcPay({
        orderId: orderIds,
        confirmUrl: import.meta.env.DEV
          ? `http://${location.host}/payment/confirm?from=ecPay&`
          : `https://${location.host}/payment/confirm?from=ecPay&`,
      }),
    );
  };

  const handlePaymentByLinePay = async () => {
    // [TODO]: jump to LINEPay
    const orderIds = orders.filter((order) => order.status === OrderStatus.FINISHED).map((order) => order.id);
    await dispatch(
      requestLinePay({
        orderId: orderIds,
        confirmUrl: import.meta.env.DEV
          ? `http://${location.host}/payment/confirm?from=linePay&`
          : `https://${location.host}/payment/confirm?from=linePay&`,
        cancelUrl: import.meta.env.DEV ? `http://${location.host}/payment/cancel` : `https://${location.host}/payment/cancel`,
      }),
    );
  };

  useEffect(() => {
    if (linePayResponse.result && linePayResponse.result.returnCode === '0000') {
      window.location.href = linePayResponse.result.info.paymentUrl.web;
    }
  }, [linePayResponse]);

  return (
    <MobileModal open={modalType === MobileModalType.PAYMENT}>
      <Typography variant='h6' fontWeight={900}>
        請選擇付款方式
      </Typography>
      <Button
        onClick={handlePaymentByCash}
        startIcon={<MoneyIcon />}
        sx={{
          color: 'common.black',
          bgcolor: 'primary.main',
          width: '100%',
        }}
      >
        現金付款
      </Button>
      <Button
        onClick={handlePaymentByCard}
        startIcon={<CreditCardIcon />}
        sx={{
          color: 'common.black',
          bgcolor: 'primary.main',
          width: '100%',
        }}
      >
        信用卡
      </Button>
      <Button
        onClick={handlePaymentByLinePay}
        sx={{
          color: 'common.black',
          bgcolor: 'primary.main',
          width: '100%',
        }}
      >
        <img src={linePay} alt='LINE Pay' style={{ height: '1.8rem' }} />
      </Button>
    </MobileModal>
  );
};
