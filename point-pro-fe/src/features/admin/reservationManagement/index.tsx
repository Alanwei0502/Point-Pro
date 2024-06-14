import { FC } from 'react';
import { ReservationTable } from './ReservationTable';
import { ReservationModal } from './ReservationModal';
import { DeleteReservationConfirmModal } from './DeleteReservationConfirmModal';
import { StartDiningConfirmModal } from './StartDiningConfirmModal';

interface IReservationManagementProps {}

export const ReservationManagement: FC<IReservationManagementProps> = () => {
  return (
    <>
      <ReservationTable />
      {/* MODAL */}
      <ReservationModal />
      <DeleteReservationConfirmModal />
      <StartDiningConfirmModal />
    </>
  );
};
