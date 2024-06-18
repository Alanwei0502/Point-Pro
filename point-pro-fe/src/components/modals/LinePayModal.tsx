import { FC } from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { TabletModal } from './TabletModal';
import { AppButton } from '../button/AppButton';
import { paymentSliceActions } from '~/store/slices';
import { LinePayResponse } from '~/types';

const { openConfirmCloseLinePayModal } = paymentSliceActions;

interface ILinePayIframeProps {
  data: LinePayResponse | null;
}

const LinePayIframe: FC<ILinePayIframeProps> = (props) => {
  const { data } = props;

  return <Box component='iframe' src={data?.result?.info.paymentUrl.web} width='90vw' height='75vh' sx={{ outline: 'none', border: 'none' }}></Box>;
};

interface ILinePayModalProps {}

export const LinePayModal: FC<ILinePayModalProps> = () => {
  const dispatch = useAppDispatch();

  const { isOpen, data } = useAppSelector((state) => state.payment.linePayModal);

  const handleClose = () => {
    dispatch(openConfirmCloseLinePayModal());
  };

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{ title: '請給客人掃描 QR Code 進行付款' }}
      cardContentProps={{
        children: <LinePayIframe data={data} />,
      }}
      cardActionsProps={{
        children: (
          <AppButton fullWidth onClick={handleClose}>
            關閉
          </AppButton>
        ),
      }}
    />
  );
};
