import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { adminUISliceActions } from '~/store/slices/admin/adminUI.slice';
import { menuManagementSliceActions } from '~/store/slices/admin/menuManagement.slice';
import { orderManagementSliceActions } from '~/store/slices/admin/orderManagement.slice';
import { takeOrderSliceActions } from '~/store/slices/admin/takeOrder.slice';
import { socketSliceActions } from '~/store/slices/socket.slice';
import { SocketRoom } from '~/types';

export const useInititalize = () => {
  const dispatch = useAppDispatch();

  const isConnected = useAppSelector((state) => state.socket.isConnected);

  // fetch all data
  useEffect(() => {
    const { getAdminMenu } = takeOrderSliceActions;
    const { getAllOrders } = orderManagementSliceActions;
    const { openAdminLoginLoading, closeAdminLoginLoading } = adminUISliceActions;
    const { getCategories, getMeals, getSpecialties } = menuManagementSliceActions;
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
    const { initSocket } = socketSliceActions;
    dispatch(initSocket());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      const { joinRoom } = socketSliceActions;
      dispatch(joinRoom(SocketRoom.ADMIN));
    }
  }, [isConnected, dispatch]);
};
