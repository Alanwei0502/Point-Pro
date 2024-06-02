import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyConfirmModal, deleteSpecialty, getSpecialties } from '~/store/slices';
import { theme } from '~/theme';

interface IDeleteSpecialtyConfirmModalProps {}

export const DeleteSpecialtyConfirmModal: FC<IDeleteSpecialtyConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuSetting.deleteSpecialtyConfirmModal);

  const handleCancel = () => {
    dispatch(closeDeleteSpecialtyConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (!data) return;
    dispatch(deleteSpecialty(data.id))
      .unwrap()
      .then(() => {
        dispatch(getSpecialties());
        handleCancel();
      });
  };

  return (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='確定刪除' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>確定要刪除整個「{data?.title}」？</Typography>
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
