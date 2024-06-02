import { FC, ReactNode } from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { BaseModal } from '~/components';
import { theme } from '~/theme';
import { cancelOrder, setCancelOrder } from '~/store/slices';

interface ITabletModalLayoutProps {
  children: ReactNode;
  open: boolean;
}

export const TabletModalLayout: FC<ITabletModalLayoutProps> = ({ children, open }) => {
  return (
    <BaseModal open={open}>
      <Box display='grid' sx={{ placeContent: 'center' }} height='100%'>
        {children}
      </Box>
    </BaseModal>
  );
};

interface ICancelOrderConfirmModalProps {}

export const CancelOrderConfirmModal: FC<ICancelOrderConfirmModalProps> = () => {
  const dispatch = useAppDispatch();
  const cancelOrderId = useAppSelector(({ order }) => order.cancelOrderId);

  const handleDeleteOrder = () => {
    dispatch(cancelOrder());
  };

  const handleCancel = () => {
    dispatch(setCancelOrder(''));
  };

  return (
    <TabletModalLayout open={!!cancelOrderId}>
      <Box display='grid' sx={{ placeContent: 'center' }} height={'100%'}>
        <Card>
          <CardHeader title='取消訂單' sx={{ backgroundColor: theme.palette.common.black, color: 'white', textAlign: 'center' }} />
          <CardContent sx={{ padding: '1.5rem 1.25rem', minWidth: '50cqw' }}>
            <Typography component='p' variant='body1' fontWeight={700} textAlign={'center'}>
              確定要取消此訂單？
            </Typography>
          </CardContent>
          <CardActions sx={{ gap: '1.5rem', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
            <Button variant='outlined' color='inherit' fullWidth onClick={handleDeleteOrder}>
              確定
            </Button>
            <Button variant='contained' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </Button>
          </CardActions>
        </Card>
      </Box>
    </TabletModalLayout>
  );
};
