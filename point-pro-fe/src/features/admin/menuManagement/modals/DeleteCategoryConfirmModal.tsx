import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { closeDeleteCategoryConfirmModal, deleteCategory, getCategories } from '~/store/slices';

interface IDeleteCategoryConfirmModalProps {}

export const DeleteCategoryConfirmModal: FC<IDeleteCategoryConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.menuManagement.deleteCategoryConfirmModal);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isInvalid = !data || isDeleteLoading;

  const handleCancel = () => {
    dispatch(closeDeleteCategoryConfirmModal());
  };

  const handleConfirmDelete = () => {
    if (isInvalid) return;

    setIsDeleteLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(deleteCategory(data.id)).unwrap();
          await dispatch(getCategories());
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
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '刪除菜單種類',
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
