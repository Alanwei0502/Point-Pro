import { FC, useEffect, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { theme } from '~/theme';
import { GENDER_TRANSLATE } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';

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

  return isOpen && data ? (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='取消預約' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>
            確定要取消「{data.username} {GENDER_TRANSLATE[data.gender]}」的預約？
          </Typography>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleConfirm} disabled={isDeleteLoading}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  ) : null;
};
