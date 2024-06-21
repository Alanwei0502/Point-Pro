import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { API_HOST } from '~/api/http';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { addNotification, resetSocket, setSocket, closeDialog, getMenu, orderSliceActions } from '~/store/slices';
import { SocketTopic } from '~/types';
import { ROUTE_PATH } from '~/utils';

enum NameSpace {
  RESERVATION = '/',
  CUSTOMER = '/customer',
  ADMIN = '/admin',
}

type useSocketProps = {
  ns: NameSpace;
};

export const useSocket = (props: useSocketProps) => {
  const { ns } = props;

  const dispatch = useAppDispatch();

  const { pathname } = useLocation();

  const adminToken = useAppSelector((state) => state.auth.authToken);
  const customerToken = useAppSelector((state) => state.dineInToken.token);

  // Socket Instance
  const { current: socket } = useRef(
    io(`${API_HOST}${ns}`, {
      autoConnect: false,
      auth: {
        token: pathname.includes(ROUTE_PATH.admin) ? adminToken : customerToken,
      },
    }),
  );

  // Connect to server & save socket instance
  useEffect(() => {
    socket.connect();
    dispatch(setSocket(socket));

    return () => {
      socket.disconnect();
      dispatch(resetSocket());
    };
  }, [dispatch, socket]);

  // CONNECTION listener
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Connect to server. ${ns} ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnect from server.');
    });

    socket.io.on('reconnect', (attempt) => {
      console.log(`Reconnect to server. ${attempt} times`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.io.off('reconnect');
    };
  }, [socket, ns]);

  // MENU listener
  useEffect(() => {
    socket.on(SocketTopic.MENU, (data) => {
      if (ns === NameSpace.CUSTOMER) {
        dispatch(getMenu());
        dispatch(closeDialog());
      }

      if (ns === NameSpace.ADMIN) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.MENU }));
        if (pathname.includes(`${ROUTE_PATH.admin}/${ROUTE_PATH.menu}`)) {
          dispatch(getMenu());
          dispatch(closeDialog());
        }
        if (pathname.includes('/admin/meal')) {
          dispatch(getMenu());
        }
      }
    });

    return () => {
      socket.off(SocketTopic.MENU);
    };
  }, [socket, ns, pathname, dispatch]);

  // ORDER listener
  useEffect(() => {
    const { getOrders } = orderSliceActions;

    socket.on(SocketTopic.ORDER, (data) => {
      if (ns === NameSpace.CUSTOMER) {
        dispatch(getOrders());
      }

      if (ns === NameSpace.ADMIN) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.ORDER }));

        if (pathname.includes('/admin/orders')) {
          dispatch(getOrders());
        }
      }
    });

    return () => {
      socket.off(SocketTopic.ORDER);
    };
  }, [socket, ns, pathname, dispatch]);

  // RESERVATION listener
  useEffect(() => {
    socket.on(SocketTopic.RESERVATION, (data) => {
      if (ns === NameSpace.ADMIN) {
        dispatch(addNotification({ ...data, notiType: SocketTopic.RESERVATION }));
      }
    });

    return () => {
      socket.off(SocketTopic.RESERVATION);
    };
  }, [socket, ns, pathname, dispatch]);
};
