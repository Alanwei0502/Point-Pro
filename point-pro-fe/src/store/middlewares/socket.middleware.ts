import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { ROUTE_PATH, SocketInterface, SocketFactory } from '~/utils';
import {
  deleteCategory,
  deleteMeal,
  deleteSpecialty,
  deleteSpecialtyItem,
  getAvailablePeriods,
  getMenu,
  newSocketSliceActions,
  orderManagementSliceActions,
  orderSliceActions,
  patchCategory,
  patchCategoryOrder,
  patchMeal,
  patchMealOrder,
  patchSpecialty,
  patchSpecialtyItem,
  patchSpecialtyOrder,
  postCategory,
  postMeal,
  postReservation,
  postSpecialty,
  postSpecialtyItem,
  reservationManagementSliceActions,
} from '../slices';
import { SocketEvent, SocketRoom, SocketTopic } from '~/types';
import type { AppDispatch, AppState } from '../store';

const { initSocket, connectionEstablished, connectionLost, joinRoom, leaveRoom } = newSocketSliceActions;

export const socketMiddleware: Middleware = (store: MiddlewareAPI<AppDispatch, AppState>) => {
  let s: SocketInterface;

  return (next) => (action) => {
    const isAdmin = window.location.href.includes(ROUTE_PATH.admin);
    const isCustomer = !isAdmin;
    const isBooking = window.location.href.includes(ROUTE_PATH.booking);
    const customerToken = store.getState().dineInToken.token;
    const adminToken = store.getState().auth.authToken;

    if (initSocket.match(action) && !s && typeof window !== 'undefined') {
      console.log('SocketMiddleware: Socket initialized');

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
        store.dispatch(getMenu());
      });

      // handle the order event
      s.socket.on(SocketTopic.ORDER, () => {
        if (isCustomer) {
          store.dispatch(orderSliceActions.getOrders());
          return;
        }

        const isInOrderManagementPage = window.location.href.includes(ROUTE_PATH.orderManagement);
        if (isInOrderManagementPage) {
          const { typeTab: type, statusTab: status } = store.getState().orderManagement;
          store.dispatch(orderManagementSliceActions.getOrders({ type, status }));
        }
      });

      // handle the reservation event
      s.socket.on(SocketTopic.RESERVATION, () => {
        if (isCustomer) {
          console.log('SocketMiddleware: Customer Receive RESERVATION');
          store.dispatch(getAvailablePeriods());
          return;
        }

        const isInReservationManagementPage = window.location.href.includes(ROUTE_PATH.reservationMangement);
        if (isInReservationManagementPage) {
          console.log('SocketMiddleware: Admin Receive RESERVATION');
          const dateFilter = store.getState().reservationManagement.dateFilter;
          store.dispatch(reservationManagementSliceActions.getAvailablePeriods());
          store.dispatch(reservationManagementSliceActions.getReservations(dateFilter));
        }
      });
    }

    if (!s) return next(action);

    // emit the joinRoom action
    if (joinRoom.match(action)) {
      const room = action.payload;
      console.log('SocketMiddleware: Joining room:', room);
      s.socket.emit(SocketEvent.JoinRoom, room);
    }

    // emit leaveRoom action
    if (leaveRoom.match(action)) {
      const room = action.payload;
      console.log('SocketMiddleware: Leaving room:', room);
      s.socket.emit(SocketEvent.LeaveRoom, room);
    }

    // emit the menu action
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
      patchSpecialtyItem.fulfilled,
      deleteSpecialtyItem.fulfilled,
    ];
    if (isAdmin && adminUpdateMenuActions.some((tp) => tp.match(action))) {
      console.log('SocketMiddleware: Emitting MENU');
      s.socket.emit(SocketTopic.MENU);
    }

    // emit the order action
    const adiminUpdateOrderActions = [
      orderManagementSliceActions.postOrder.fulfilled,
      orderManagementSliceActions.cancelOrder.fulfilled,
      orderManagementSliceActions.patchOrderMealServedAmount.fulfilled,
    ];

    if (isAdmin && adiminUpdateOrderActions.some((tp) => tp.match(action))) {
      console.log('SocketMiddleware: Emitting ORDER');
      s.socket.emit(SocketTopic.ORDER);
    }
    if (isCustomer && orderSliceActions.postOrder.fulfilled.match(action)) {
      console.log('SocketMiddleware: Emitting ORDER');
      s.socket.emit(SocketTopic.ORDER); // TODO: with reservationId
    }

    // emit the reservation action
    const allUpdateReservationActions = [
      reservationManagementSliceActions.postReservation.fulfilled,
      reservationManagementSliceActions.patchReservation.fulfilled,
      reservationManagementSliceActions.deleteReservation.fulfilled,
    ];

    if (isAdmin && allUpdateReservationActions.some((tp) => tp.match(action))) {
      console.log('SocketMiddleware: Emitting RESERVATION');
      s.socket.emit(SocketTopic.RESERVATION);
    }

    if (isCustomer && postReservation.fulfilled.match(action)) {
      console.log('SocketMiddleware: Emitting RESERVATION');
      s.socket.emit(SocketTopic.RESERVATION);
    }

    next(action);
  };
};
