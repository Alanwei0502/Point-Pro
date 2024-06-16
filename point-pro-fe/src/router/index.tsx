import { Navigate, createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './protected';
import { OrderManagement } from '~/features/admin/orderManagement';
import { TakeOrder } from '~/features/admin/takeOrder';
import { MenuManagement } from '~/features/admin/menuManagement';
import { ReservationManagement } from '~/features/admin/reservationManagement';
import { Booking } from '~/features/customer/booking';
import { Menu } from '~/features/customer/menu';
// import { PaymentCancel, PaymentConfirm } from '~/features/customer/payment';
import { pathObj } from '~/components';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // User
      {
        index: true,
        element: <Home />,
      },
      {
        path: pathObj.booking,
        element: <Booking />,
      },
      {
        path: pathObj.menu,
        element: <Menu />,
      },
      {
        path: pathObj.payment,
        children: [
          // {
          //   path: pathObj.confirm,
          //   element: <PaymentConfirm />,
          // },
          // {
          //   path: pathObj.cancel,
          //   element: <PaymentCancel />,
          // },
        ],
      },
      // Admin
      {
        path: pathObj.admin,
        element: <Login />,
      },
      {
        path: pathObj.admin,
        element: <ProtectedRoute />,
        children: [
          {
            path: pathObj.orderManagement,
            element: <OrderManagement />,
          },
          {
            path: pathObj.takeOrder,
            element: <TakeOrder />,
          },
          {
            path: pathObj.reservationMangament,
            element: <ReservationManagement />,
          },
          {
            path: pathObj.menuManagament,
            element: <MenuManagement />,
          },
        ],
      },
      {
        path: `${pathObj.admin}/*`,
        element: <Navigate to='.' replace />,
      },
    ],
  },
]);

export default router;
