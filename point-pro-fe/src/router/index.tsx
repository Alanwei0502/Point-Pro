import { createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './protected';
import { AdminOrders } from '~/features/admin/orders';
import { AdminTakeOrder } from '~/features/admin/take-order';
import { AdminMenuSettings } from '~/features/admin/menu';
import { AdminSeat } from '~/features/admin/seat';
import { Booking } from '~/features/customer/booking';
import { TakeOrders } from '~/features/customer/take-order';
import { PaymentCancel, PaymentConfirm } from '~/features/customer/payment';

const router = createBrowserRouter([
  // User
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'booking',
    element: <Booking />,
  },
  {
    path: 'take-orders',
    element: <TakeOrders />,
  },
  {
    path: 'payment',
    children: [
      {
        path: 'confirm',
        element: <PaymentConfirm />,
      },
      {
        path: 'cancel',
        element: <PaymentCancel />,
      },
    ],
  },
  // Admin
  {
    path: 'admin',
    element: <Login />,
  },
  {
    path: 'admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'take-order',
        element: <AdminTakeOrder />,
      },
      {
        path: 'seat',
        element: <AdminSeat />,
      },
      {
        path: 'menu',
        element: <AdminMenuSettings />,
      },
    ],
  },
]);

export default router;
