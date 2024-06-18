import { FC } from 'react';
import { PaymentModal, StartDiningQRCodeModal } from '~/components';
import { ReservationTable } from './ReservationTable';
import { ReservationModal } from './modals/ReservationModal';
import { DeleteReservationConfirmModal } from './modals/DeleteReservationConfirmModal';
import { StartDiningConfirmModal } from './modals/StartDiningConfirmModal';

interface IReservationManagementProps {}

export const ReservationManagement: FC<IReservationManagementProps> = () => {
  return (
    <>
      <ReservationTable />
      {/* MODAL */}
      <ReservationModal />
      <DeleteReservationConfirmModal />
      <StartDiningConfirmModal />
      <StartDiningQRCodeModal />
      <PaymentModal />
    </>
  );
};
