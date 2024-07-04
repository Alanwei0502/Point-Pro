import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';

const { closeDeleteMealConfirmModal, deleteMeal, getMeals } = menuManagementSliceActions;

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
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '刪除餐點',
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
