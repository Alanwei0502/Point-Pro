import { FC, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch } from '~/hooks';
import { paymentSliceActions } from '~/store/slices/admin/payment.slice';

const { confirmLinePay } = paymentSliceActions;

interface ILinePayConfirmProps {}

const LinePayConfirm: FC<ILinePayConfirmProps> = () => {
  const dispatch = useAppDispatch();

  const [description, setDescription] = useState('付款中...');

  useEffect(() => {
    const url = new URL(location.href);
    const paymentId = url.searchParams.get('orderId');
    const transactionId = url.searchParams.get('transactionId');
    if (paymentId && transactionId) {
      dispatch(confirmLinePay({ paymentId, transactionId }))
        .unwrap()
        .then(() => {
          setDescription('確認付款成功，可關閉畫面');
          window.parent.postMessage('close', window.location.origin);
        })
        .catch(() => {
          setDescription('請至 LINE 後台確認付款狀態');
        });
    }
  }, [dispatch]);

  return (
    <Box height='100vh' width='100vw' display='flex' alignItems='center' justifyContent='center' fontSize={40} fontWeight={900}>
      {description}
    </Box>
  );
};

export default LinePayConfirm;
