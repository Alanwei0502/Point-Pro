import { FC, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import { AppButton, TabletModal } from '~/components';
import { GENDER_TRANSLATE } from '~/constants';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices';

const { closeDeleteReservationConfirmModal, getReservations, deleteReservation, getAvailablePeriods } = reservationManagementSliceActions;

interface IDeleteReservationConfirmModalProps {}

export const DeleteReservationConfirmModal: FC<IDeleteReservationConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const { isOpen, data } = useAppSelector((state) => state.reservationManagement.deleteReservationConfirmModal);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const handleCancel = () => {
    dispatch(closeDeleteReservationConfirmModal());
  };

  const handleConfirm = () => {
    if (!data) return;
    setIsDeleteLoading(true);
    toast
      .promise(
        async () => {
          await dispatch(deleteReservation(data.id)).unwrap();
          dispatch(getReservations(dateFilter));
          dispatch(getAvailablePeriods());
          dispatch(closeDeleteReservationConfirmModal());
        },
        {
          pending: '取消中...',
          success: '取消成功',
          error: '取消失敗',
        },
      )
      .finally(() => {
        setIsDeleteLoading(false);
      });
  };

  useEffect(() => {
    dispatch(getAvailablePeriods());
  }, [dispatch]);

  if (!data) return null;

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '取消預約',
      }}
      cardContentProps={{
        children: (
          <Typography textAlign='center'>
            確定要取消「{data.username} {GENDER_TRANSLATE[data.gender]}」的預約？
          </Typography>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirm} disabled={isDeleteLoading}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
