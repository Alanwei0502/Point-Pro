import { FC, useState } from 'react';
import { Card, CardActions, CardContent, CardHeader, Typography } from '@mui/material';
import { AppButton, TabletModalLayout } from '~/components';
import { theme } from '~/theme';
import { GENDER_TRANSLATE } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { reservationManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const { closeStartDiningConfirmModal, getReservations, startDiningReservation, getAvailablePeriods } = reservationManagementSliceActions;

interface IStartDiningConfirmModalProps {}

export const StartDiningConfirmModal: FC<IStartDiningConfirmModalProps> = () => {
  const dispatch = useAppDispatch();

  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const { isOpen, data } = useAppSelector((state) => state.reservationManagement.startDiningConfirmModal);
  const dateFilter = useAppSelector((state) => state.reservationManagement.dateFilter);

  const handleCancel = () => {
    dispatch(closeStartDiningConfirmModal());
  };

  const handleConfirm = () => {
    if (!data) return;
    setIsUpdateLoading(true);
    toast
      .promise(
        async () => {
          const res = await dispatch(startDiningReservation()).unwrap();
          dispatch(getReservations(dateFilter));
          dispatch(getAvailablePeriods());
          dispatch(closeStartDiningConfirmModal());
          // dispatch(openQrCodeModal(res));
        },
        {
          pending: '更新中...',
          success: '更新成功',
          error: {
            render({ data }) {
              if (data instanceof AxiosError) {
                return data.response?.data.result;
              }
            },
          },
        },
      )
      .finally(() => {
        setIsUpdateLoading(false);
        dispatch(closeStartDiningConfirmModal());
      });
  };

  return isOpen && data ? (
    <TabletModalLayout open={isOpen}>
      <Card>
        <CardHeader title='開始用餐' sx={{ backgroundColor: theme.palette.primary.main, textAlign: 'center' }} />
        <CardContent sx={{ padding: '1rem', width: '50cqw' }}>
          <Typography textAlign='center'>
            確定「{data.username} {GENDER_TRANSLATE[data.gender]}」準備入座開始用餐？
          </Typography>
        </CardContent>
        <CardActions>
          <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
            取消
          </AppButton>
          <AppButton fullWidth onClick={handleConfirm} disabled={isUpdateLoading}>
            確定
          </AppButton>
        </CardActions>
      </Card>
    </TabletModalLayout>
  ) : null;
};
