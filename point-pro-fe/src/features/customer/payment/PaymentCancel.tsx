import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { useAppSelector } from '~/hooks';
import { Column, MobileLayout } from '~/components';
import { getToken } from '~/utils';

interface IPaymentConfirmProps {}

export const PaymentCancel: FC<IPaymentConfirmProps> = () => {
  const navigate = useNavigate();
  const userRole = useAppSelector(({ auth }) => auth.userRole);

  const handleReturnMeal = () => {
    const token = getToken();
    userRole?.role === 'USER' ? navigate(`/orders?token=${token}`) : navigate('/admin/orders');
  };
  return (
    <MobileLayout>
      <Column justifyContent={'space-between'} p={3} sx={{ height: '100%', minHeight: '90vh', userSelect: 'none' }}>
        <Typography variant='h1' textAlign={'center'}>
          取消付款
        </Typography>
        <Button variant='contained' color='primary' onClick={handleReturnMeal}>
          {userRole?.role === 'USER' ? '返回繼續點餐' : '返回訂單頁面'}
        </Button>
      </Column>
    </MobileLayout>
  );
};
