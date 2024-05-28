import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { FC } from 'react';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyConfirmModal, deleteCategory, deleteSpecialty } from '~/store/slices';
import { theme } from '~/theme';

interface IDeleteSpecialtyConfirmModalProps {}

export const DeleteSpecialtyConfirmModal: FC<IDeleteSpecialtyConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menu.deleteSpecialtyConfirmModal);

  const handleCancel = () => {
    dispatch(closeDeleteSpecialtyConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (!data) return;
    dispatch(deleteSpecialty(data.id));
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='確定刪除' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1.5rem 1.25rem', minWidth: '50cqw' }}>
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
