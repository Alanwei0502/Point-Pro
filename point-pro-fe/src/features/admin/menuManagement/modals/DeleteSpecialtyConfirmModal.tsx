import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteSpecialtyConfirmModal, deleteSpecialty, getSpecialties } from '~/store/slices';

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
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '刪除客製化種類',
      }}
      cardContentProps={{
        children: <Typography textAlign='center'>確定要刪除整個「{data?.title}」？</Typography>,
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
