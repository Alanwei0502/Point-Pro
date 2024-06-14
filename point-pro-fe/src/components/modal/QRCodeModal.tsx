import { FC } from 'react';
import { TabletModal } from './TabletModal';

interface IQRCodeModalProps {}

const QRCodeModal: FC<IQRCodeModalProps> = () => {
  return <TabletModal open={false}>QRCodeModal</TabletModal>;
};

export default QRCodeModal;
