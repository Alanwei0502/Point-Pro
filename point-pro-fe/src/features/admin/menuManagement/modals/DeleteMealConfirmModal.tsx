import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteMealConfirmModal, deleteMeal, getMeals } from '~/store/slices';
import { theme } from '~/theme';

interface IDeleteMealConfirmModalProps {}

export const DeleteMealConfirmModal: FC<IDeleteMealConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuManagement.deleteMealConfirmModal);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isInvalid = !data || isDeleteLoading;

  const handleCancel = () => {
    dispatch(closeDeleteMealConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (isInvalid) return;

    setIsDeleteLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(deleteMeal(data.id)).unwrap();
          await dispatch(getMeals());
        },
        {
          pending: '刪除中...',
          success: '刪除成功',
          error: '刪除失敗',
        },
      )
      .finally(() => {
        setIsDeleteLoading(false);
        handleCancel();
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='刪除餐點' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>確定要刪除「{data?.title}」？</Typography>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleConfirmDelete} disabled={isInvalid}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  );
};
