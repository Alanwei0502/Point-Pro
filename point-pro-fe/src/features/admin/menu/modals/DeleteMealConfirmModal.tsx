import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { FC } from 'react';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteMealConfirmModal, deleteMeal, getMeals } from '~/store/slices';
import { theme } from '~/theme';

interface IDeleteMealConfirmModalProps {}

export const DeleteMealConfirmModal: FC<IDeleteMealConfirmModalProps> = () => {
  const dispatch = useAppDispatch();
  const { isOpen, data } = useAppSelector((state) => state.menu.deleteMealConfirmModal);

  const handleCancel = () => {
    dispatch(closeDeleteMealConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (!data) return;
    dispatch(deleteMeal(data.id))
      .unwrap()
      .then(() => {
        dispatch(getMeals());
        handleCancel();
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='確定刪除' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography component='p' variant='body1' textAlign={'center'}>
            確定要刪除「{data?.title}」？
          </Typography>
        </CardContent>
        <CardActions>
          <BaseButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </BaseButton>
          <BaseButton variant='contained' color='primary' fullWidth onClick={handleConfirmDelete}>
            確定
          </BaseButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
