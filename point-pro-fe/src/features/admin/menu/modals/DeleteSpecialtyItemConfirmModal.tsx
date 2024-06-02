import { FC } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { BaseButton, TabletModalLayout } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyItemConfirmModal, deleteSpecialtyItem, getSpecialties } from '~/store/slices';
import { theme } from '~/theme';

interface IDeleteSpecialtyItemConfirmModalProps {}

export const DeleteSpecialtyItemConfirmModal: FC<IDeleteSpecialtyItemConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuSetting.deleteSpecialtyItemConfirmModal);

  const handleCancel = () => {
    dispatch(closeDeleteSpecialtyItemConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (!data) return;
    dispatch(deleteSpecialtyItem(data.id))
      .unwrap()
      .then(() => {
        dispatch(getSpecialties());
        handleCancel();
      });
  };

  return isOpen ? (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='確定刪除' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>確定要刪除「{data?.title}」？</Typography>
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
  ) : null;
};
