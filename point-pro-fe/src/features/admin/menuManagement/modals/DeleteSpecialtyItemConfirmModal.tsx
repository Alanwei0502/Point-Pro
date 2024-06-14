import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyItemConfirmModal, deleteSpecialtyItem, getSpecialties } from '~/store/slices';

interface IDeleteSpecialtyItemConfirmModalProps {}

export const DeleteSpecialtyItemConfirmModal: FC<IDeleteSpecialtyItemConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuManagement.deleteSpecialtyItemConfirmModal);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isInvalid = !data || isDeleteLoading;

  const handleCancel = () => {
    dispatch(closeDeleteSpecialtyItemConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (isInvalid) return;

    setIsDeleteLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(deleteSpecialtyItem(data.id)).unwrap();
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
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '刪除客製化選項',
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>確定要刪除「{data?.title}」？</Typography>,
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirmDelete} disabled={isInvalid}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
