import { FC } from 'react';
import { ReservationList } from './tab';
import { ReservationModal } from './ReservationModal';

interface IReservationManagementProps {}

export const ReservationManagement: FC<IReservationManagementProps> = () => {
  return (
    <>
      <ReservationList />
      <ReservationModal />
    </>
  );
};
