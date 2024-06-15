import { FC, useState } from 'react';
import { Typography } from '@mui/material';
import { AppButton, TabletModal } from '~/components';
import { GENDER_TRANSLATE } from '~/utils';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { adminUISliceActions, reservationManagementSliceActions } from '~/store/slices';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

const { closeStartDiningConfirmModal, getReservations, startDiningReservation, getAvailablePeriods } = reservationManagementSliceActions;
const { openStartDiningQRCodeModal } = adminUISliceActions;

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
          dispatch(openStartDiningQRCodeModal(res.result));
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

  if (!data) return null;

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{
        title: '開始用餐',
      }}
      cardContentProps={{
        children: (
          <Typography textAlign='center'>
            確定「{data.username} {GENDER_TRANSLATE[data.gender]}」準備入座開始用餐？
          </Typography>
        ),
      }}
      cardActionsProps={{
        children: (
          <>
            <AppButton variant='outlined' color='secondary' fullWidth onClick={handleCancel}>
              取消
            </AppButton>
            <AppButton fullWidth onClick={handleConfirm} disabled={isUpdateLoading}>
              確定
            </AppButton>
          </>
        ),
      }}
    />
  );
};
