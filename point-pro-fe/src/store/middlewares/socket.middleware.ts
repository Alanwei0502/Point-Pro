import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { ROUTE_PATH } from '~/constants';
import { SocketInterface, SocketFactory } from '~/utils';
import { AppDispatch, AppState, SocketEvent, SocketTopic } from '~/types';
import { socketSliceActions } from '../slices/socket.slice';
import { reservationManagementSliceActions } from '../slices/admin/reservationManagement.slice';
import { takeOrderSliceActions } from '../slices/admin/takeOrder.slice';
import { orderSliceActions } from '../slices/customer/order.slice';
import { orderManagementSliceActions } from '../slices/admin/orderManagement.slice';
import { menuSliceActions } from '../slices/customer/menu.slice';
import { menuManagementSliceActions } from '../slices/admin/menuManagement.slice';

const { initSocket, connectionEstablished, connectionLost, joinRoom, leaveRoom, setAdminNotification } = socketSliceActions;
const { postReservation, getAvailablePeriods } = reservationManagementSliceActions;
const { getMenu } = menuSliceActions;
const { getAdminMenu } = takeOrderSliceActions;
const {
  getCategories,
  getMeals,
  getSpecialties,
  postCategory,
  patchCategory,
  patchCategoryOrder,
  deleteCategory,
  postMeal,
  patchMeal,
  patchMealOrder,
  deleteMeal,
  postSpecialty,
  patchSpecialty,
  patchSpecialtyOrder,
  deleteSpecialty,
  postSpecialtyItem,
  patchSpecialtyItem,
  deleteSpecialtyItem,
} = menuManagementSliceActions;

export const socketMiddleware: Middleware = (store: MiddlewareAPI<AppDispatch, AppState>) => {
  let s: SocketInterface;

  return (next) => (action) => {
    const isAdmin = window.location.href.includes(ROUTE_PATH.admin);
    const isCustomer = !isAdmin;
    const isBooking = window.location.href.includes(ROUTE_PATH.booking);
    const customerToken = store.getState().dineInToken.token;
    const adminToken = store.getState().auth.authToken;

    if (!s && initSocket.match(action) && typeof window !== 'undefined') {
      s = SocketFactory.create({
        extraHeaders: {
          isbooking: isBooking.toString(),
          isadmin: isAdmin.toString(),
          token: isAdmin ? adminToken : customerToken,
        },
      });

      s.socket.on(SocketEvent.Connect, () => {
        store.dispatch(connectionEstablished());
      });

      // handle all Error events
      s.socket.on(SocketEvent.Error, (message) => {
        console.error(message);
      });

      // handle disconnect event
      s.socket.on(SocketEvent.Disconnect, (reason) => {
        store.dispatch(connectionLost());
      });

      // handle the menu event
      s.socket.on(SocketTopic.MENU, () => {
        if (isCustomer) {
          store.dispatch(getMenu());
        }

        if (isAdmin) {
          store.dispatch(
            setAdminNotification({
              id: Date.now(),
              title: '菜單更新',
            }),
          );
          const isInTakeOrderPage = window.location.href.includes(ROUTE_PATH.takeOrder);
          const isInMenuManagementPage = window.location.href.includes(ROUTE_PATH.menuManagement);
          if (isInTakeOrderPage) {
            store.dispatch(getAdminMenu());
          }
          if (isInMenuManagementPage) {
            store.dispatch(getCategories());
            store.dispatch(getMeals());
            store.dispatch(getSpecialties());
          }
        }
      });

      // handle the order event
      s.socket.on(SocketTopic.ORDER, () => {
        if (isCustomer) {
          store.dispatch(orderSliceActions.getOrders());
        }

        if (isAdmin) {
          store.dispatch(
            setAdminNotification({
              id: Date.now(),
              title: '訂單更新',
            }),
          );
          const isInOrderManagementPage = window.location.href.includes(ROUTE_PATH.orderManagement);
          if (isInOrderManagementPage) {
            const { typeTab: type, statusTab: status } = store.getState().orderManagement;
            store.dispatch(orderManagementSliceActions.getOrders({ type, status }));
          }
        }
      });

      // handle the reservation event
      s.socket.on(SocketTopic.RESERVATION, () => {
        if (isCustomer) {
          store.dispatch(getAvailablePeriods());
        }

        if (isAdmin) {
          store.dispatch(
            setAdminNotification({
              id: Date.now(),
              title: '預約更新',
            }),
          );
          const isInReservationManagementPage = window.location.href.includes(ROUTE_PATH.reservationMangement);
          if (isInReservationManagementPage) {
            const dateFilter = store.getState().reservationManagement.dateFilter;
            store.dispatch(reservationManagementSliceActions.getAvailablePeriods());
            store.dispatch(reservationManagementSliceActions.getReservations(dateFilter));
          }
        }
      });
    }

    if (!s) return next(action);

    // emit the joinRoom action
    if (joinRoom.match(action)) {
      const room = action.payload;
      console.log('Joining room:', room);
      s.socket.emit(SocketEvent.JoinRoom, room);
    }

    // emit leaveRoom action
    if (leaveRoom.match(action)) {
      const room = action.payload;
      console.log('Leaving room:', room);
      s.socket.emit(SocketEvent.LeaveRoom, room);
    }

    if (isAdmin) {
      // [EMIT MENU ACTION]
      const adminUpdateMenuActions = [
        postCategory.fulfilled,
        patchCategory.fulfilled,
        patchCategoryOrder.fulfilled,
        deleteCategory.fulfilled,
        postMeal.fulfilled,
        patchMeal.fulfilled,
        patchMealOrder.fulfilled,
        deleteMeal.fulfilled,
        postSpecialty.fulfilled,
        patchSpecialty.fulfilled,
        patchSpecialtyOrder.fulfilled,
        deleteSpecialty.fulfilled,
        postSpecialtyItem.fulfilled,
        patchSpecialtyItem.fulfilled,
        deleteSpecialtyItem.fulfilled,
      ];
      if (adminUpdateMenuActions.some((a) => a.match(action))) {
        s.socket.emit(SocketTopic.MENU);
      }

      // [EMIT ORDER ACTION]
      const adiminUpdateOrderActions = [
        orderManagementSliceActions.postOrder.fulfilled,
        orderManagementSliceActions.cancelOrder.fulfilled,
        orderManagementSliceActions.patchOrderMealServedAmount.fulfilled,
      ];
      if (adiminUpdateOrderActions.some((a) => a.match(action))) {
        const reservationId = store.getState().orderManagement.socketPayload?.reservationId;
        s.socket.emit(SocketTopic.ORDER, reservationId);
        store.dispatch(orderManagementSliceActions.setSocketOrderPayload(null));
      }

      // [EMIT RESERVATION ACTION]
      const allUpdateReservationActions = [
        reservationManagementSliceActions.postReservation.fulfilled,
        reservationManagementSliceActions.patchReservation.fulfilled,
        reservationManagementSliceActions.deleteReservation.fulfilled,
      ];
      if (allUpdateReservationActions.some((a) => a.match(action))) {
        s.socket.emit(SocketTopic.RESERVATION);
      }
    }

    if (isCustomer) {
      // [EMIT ORDER ACTION]
      const customerUpdateOrderActions = [orderSliceActions.postOrder.fulfilled];
      if (customerUpdateOrderActions.some((a) => a.match(action))) {
        s.socket.emit(SocketTopic.ORDER);
      }

      // [EMIT RESERVATION ACTION]
      if (postReservation.fulfilled.match(action)) {
        s.socket.emit(SocketTopic.RESERVATION);
      }
    }

    next(action);
  };
};
