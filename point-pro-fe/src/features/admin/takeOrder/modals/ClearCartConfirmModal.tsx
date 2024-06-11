import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { theme } from '~/theme';
import { takeOrderSliceActions } from '~/store/slices';

interface IClearCartConfirmModalProps {}

export const ClearCartConfirmModal: FC<IClearCartConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.takeOrder.clearCartConfirmModal.isOpen);

  const handleClearCart = () => {
    dispatch(takeOrderSliceActions.clearCart());
    dispatch(takeOrderSliceActions.closeClearCartConfirmModal());
  };

  const handleCancel = () => {
    dispatch(takeOrderSliceActions.closeClearCartConfirmModal());
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='清空所有已點項目' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', minWidth: '50cqw' }}>
          <Typography textAlign={'center'}>確定要刪除目前已點的所有項目？</Typography>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleClearCart}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
