import { FC, lazy } from 'react';
import { StartDiningQRCodeModal } from '~/components';
import { ReservationModal } from './modals/ReservationModal';
import { DeleteReservationConfirmModal } from './modals/DeleteReservationConfirmModal';
import { StartDiningConfirmModal } from './modals/StartDiningConfirmModal';

const ReservationTable = lazy(() => import('./ReservationTable'));

interface IReservationManagementProps {}

const ReservationManagement: FC<IReservationManagementProps> = () => {
  return (
    <>
      <ReservationTable />
      {/* MODAL */}
      <ReservationModal />
      <DeleteReservationConfirmModal />
      <StartDiningConfirmModal />
      <StartDiningQRCodeModal />
    </>
  );
};

export default ReservationManagement;
