import { FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyConfirmModal, deleteSpecialty, getSpecialties } from '~/store/slices';
import { theme } from '~/theme';
import { toast } from 'react-toastify';

interface IDeleteSpecialtyConfirmModalProps {}

export const DeleteSpecialtyConfirmModal: FC<IDeleteSpecialtyConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuManagement.deleteSpecialtyConfirmModal);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isInvalid = !data || isDeleteLoading;

  const handleCancel = () => {
    dispatch(closeDeleteSpecialtyConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (isInvalid) return;

    setIsDeleteLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(deleteSpecialty(data.id)).unwrap();
          await dispatch(getSpecialties());
        },
        {
          pending: '刪除中...',
          success: '刪除成功',
          error: '刪除失敗',
        },
      )
      .finally(() => {
        handleCancel();
        setIsDeleteLoading(false);
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='刪除客製化種類' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>確定要刪除整個「{data?.title}」？</Typography>
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
