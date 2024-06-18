import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './ProtectedRoute';
import { OrderManagement } from '~/features/admin/orderManagement';
import { TakeOrder } from '~/features/admin/takeOrder';
import { MenuManagement } from '~/features/admin/menuManagement';
import { ReservationManagement } from '~/features/admin/reservationManagement';
import { Booking } from '~/features/customer/booking';
import { Menu } from '~/features/customer/menu';
import { Box } from '@mui/material';
import { ROUTE_PATH } from '~/utils';
import { LinePayCancel, LinePayConfirm } from '~/components';

const router = createBrowserRouter(
  [
    // User
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: ROUTE_PATH.booking,
          element: <Booking />,
        },
        {
          path: ROUTE_PATH.menu,
          element: <Menu />,
        },
        {
          path: ROUTE_PATH.linepay,
          children: [
            {
              path: ROUTE_PATH.confirm,
              element: <LinePayConfirm />,
            },
            {
              path: ROUTE_PATH.cancel,
              element: <LinePayCancel />,
            },
          ],
        },
        {
          path: ROUTE_PATH.admin,
          element: <Login />,
        },
        {
          path: ROUTE_PATH.admin,
          element: <ProtectedRoute />,
          children: [
            {
              path: ROUTE_PATH.orderManagement,
              element: <OrderManagement />,
            },
            {
              path: ROUTE_PATH.takeOrder,
              element: <TakeOrder />,
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
