import { createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './protected';
import { AdminOrders } from '~/features/admin/orders';
import { AdminTakeOrder } from '~/features/admin/take-order';
import { AdminMenuSettings } from '~/features/admin/menu';
import { AdminSeat } from '~/features/admin/seat';
import { Booking } from '~/features/customer/booking';
import { Menu } from '~/features/customer/menu';
import { PaymentCancel, PaymentConfirm } from '~/features/customer/payment';
import { pathObj } from '~/components';

const router = createBrowserRouter([
  // User
  {
    path: '/',
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
      {
        path: pathObj.confirm,
        element: <PaymentConfirm />,
      },
      {
        path: pathObj.cancel,
        element: <PaymentCancel />,
      },
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
        path: pathObj.order,
        element: <AdminOrders />,
      },
      {
        path: pathObj.takeOrder,
        element: <AdminTakeOrder />,
      },
      {
        path: pathObj.seat,
        element: <AdminSeat />,
      },
      {
        path: pathObj.menuSetting,
        element: <AdminMenuSettings />,
      },
    ],
  },
]);

export default router;
