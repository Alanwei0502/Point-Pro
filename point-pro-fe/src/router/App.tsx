import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from '~/features/home';
import { ROUTE_PATH } from '~/utils';
import { LinePayCancel, LinePayConfirm, LoadingMask } from '~/components';
import ProtectedRoute from './ProtectedRoute';

const Booking = lazy(() => import('~/features/customer/booking'));
const Menu = lazy(() => import('~/features/customer/menu'));
const TakeOrder = lazy(() => import('~/features/admin/takeOrder'));
const OrderManagement = lazy(() => import('~/features/admin/orderManagement'));
const MenuManagement = lazy(() => import('~/features/admin/menuManagement'));
const ReservationManagement = lazy(() => import('~/features/admin/reservationManagement'));

const router = createBrowserRouter(
  [
    // User
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: ROUTE_PATH.booking,

          element: (
            <Suspense fallback={<LoadingMask />}>
              <Booking />
            </Suspense>
          ),
        },
        {
          path: ROUTE_PATH.menu,
          element: (
            <Suspense fallback={<LoadingMask />}>
              <Menu />
            </Suspense>
          ),
        },
        {
          path: ROUTE_PATH.linepay,
          children: [
            {
              path: ROUTE_PATH.confirm,
              element: (
                <Suspense fallback={<LoadingMask />}>
                  <LinePayConfirm />
                </Suspense>
              ),
            },
            {
              path: ROUTE_PATH.cancel,
              element: (
                <Suspense fallback={<LoadingMask />}>
                  <LinePayCancel />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: ROUTE_PATH.admin,
          element: <ProtectedRoute />,
          children: [
            {
              path: ROUTE_PATH.takeOrder,
              element: <TakeOrder />,
            },
            {
              path: ROUTE_PATH.orderManagement,
              element: <OrderManagement />,
            },
            {
              path: ROUTE_PATH.reservationMangement,
              element: <ReservationManagement />,
            },
            {
              path: ROUTE_PATH.menuManagement,
              element: <MenuManagement />,
            },
            {
              path: '*',
              element: (
                <Box display='flex' height='100%' alignItems='center' justifyContent='center'>
                  無此頁面
                </Box>
              ),
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);

export const App = () => {
  return <RouterProvider router={router} />;
};
