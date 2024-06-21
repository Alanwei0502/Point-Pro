import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  adminUISliceActions,
  getCategories,
  getMeals,
  getSpecialties,
  newSocketSliceActions,
  orderManagementSliceActions,
  takeOrderSliceActions,
} from '~/store/slices';
import { SocketRoom } from '~/types';

export const useInititalize = () => {
  const dispatch = useAppDispatch();

  const isConnected = useAppSelector((state) => state.newSocket.isConnected);

  // fetch all data
  useEffect(() => {
    const { getAdminMenu } = takeOrderSliceActions;
    const { getAllOrders } = orderManagementSliceActions;
    const { openAdminLoginLoading, closeAdminLoginLoading } = adminUISliceActions;
    dispatch(openAdminLoginLoading());
    Promise.allSettled([
      dispatch(getAdminMenu()).unwrap(),
      dispatch(getCategories()).unwrap(),
      dispatch(getMeals()).unwrap(),
      dispatch(getSpecialties()).unwrap(),
      dispatch(getAllOrders()).unwrap(),
    ])
      .then(() => {
        dispatch(closeAdminLoginLoading());
      })
      .catch(() => {
        toast.error('系統錯誤，請重新整理頁面');
      });
  }, [dispatch]);

  // connect socket
  useEffect(() => {
    const { initSocket } = newSocketSliceActions;
    dispatch(initSocket());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      const { joinRoom } = newSocketSliceActions;
      dispatch(joinRoom(SocketRoom.ADMIN));
    }
  }, [isConnected, dispatch]);
};
