import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { postOrder, takeOrderSlice } from '~/store/slices';
import { theme } from '~/theme';

interface ISubmitCartConfirmModalProps {}

export const SubmitCartConfirmModal: FC<ISubmitCartConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { closeSubmitCartConfirmModal } = takeOrderSlice.actions;

  const isOpen = useAppSelector((state) => state.takeOrder.submitCartConfirmModal.isOpen);

  const handleSubmitOrder = () => {
    // dispatch(postOrder({ isCustomer: false }));
    dispatch(closeSubmitCartConfirmModal());
  };

  const handleCancel = () => {
    dispatch(closeSubmitCartConfirmModal());
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='送出訂單' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', minWidth: '50cqw' }}>
          <Typography textAlign='center'>請再次確定訂單內容無誤，即將送出訂單。</Typography>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleSubmitOrder}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
