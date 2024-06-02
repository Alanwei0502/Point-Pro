import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { takeOrderSlice } from '~/store/slices';
import { theme } from '~/theme';

interface IClearCartConfirmModalProps {}

export const ClearCartConfirmModal: FC<IClearCartConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { closeClearCartConfirmModal } = takeOrderSlice.actions;

  const isOpen = useAppSelector((state) => state.takeOrder.clearCartConfirmModal.isOpen);

  const handleClearCart = () => {
    // dispatch(clearCart());
    dispatch(closeClearCartConfirmModal());
  };

  const handleCancel = () => {
    dispatch(closeClearCartConfirmModal());
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='清空所有已點項目' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', minWidth: '50cqw' }}>
          <Typography textAlign={'center'}>確定要刪除目前已點的所有項目？</Typography>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleClearCart}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
