import { FC, lazy, Suspense } from 'react';
import { Loading, StartDiningQRCodeModal } from '~/components';
import { ReservationModal } from './modals/ReservationModal';
import { DeleteReservationConfirmModal } from './modals/DeleteReservationConfirmModal';
import { StartDiningConfirmModal } from './modals/StartDiningConfirmModal';

const ReservationTable = lazy(() => import('./ReservationTable'));

interface IReservationManagementProps {}

const ReservationManagement: FC<IReservationManagementProps> = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ReservationTable />
      </Suspense>
      {/* MODAL */}
      <ReservationModal />
      <DeleteReservationConfirmModal />
      <StartDiningConfirmModal />
      <StartDiningQRCodeModal />
    </>
  );
};

export default ReservationManagement;
