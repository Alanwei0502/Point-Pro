import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { adminUISliceActions } from '~/store/slices';
import { AppButton } from '~/components';
import logo from '~/assets/images/logo.svg';
import { TabletModal } from './TabletModal';

const { closeStartDiningQRCodeModal } = adminUISliceActions;

interface IStartDiningQRCodeModalProps {}

export const StartDiningQRCodeModal: FC<IStartDiningQRCodeModalProps> = () => {
  const dispatch = useAppDispatch();
  const { isOpen, data: qrCodeLink } = useAppSelector((state) => state.adminUI.startDiningQRCodeModal);
  if (!qrCodeLink) return null;

  return (
    <TabletModal
      open={isOpen}
      cardHeaderProps={{ title: '點餐QRCode' }}
      cardContentProps={{
        children: (
          <Box textAlign='center'>
            <QRCodeSVG
              value={qrCodeLink}
              includeMargin={true}
              level='L'
              size={250}
              imageSettings={{
                src: logo,
                excavate: true,
                height: 50,
                width: 50,
              }}
            />
            <Typography>列印後請客人掃取條碼進行點餐</Typography>
          </Box>
        ),
      }}
      cardActionsProps={{
        children: (
          <AppButton fullWidth onClick={() => dispatch(closeStartDiningQRCodeModal())}>
            關閉
          </AppButton>
        ),
      }}
    />
  );
};
