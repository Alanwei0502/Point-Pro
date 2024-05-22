import { createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './protected';
import { AdminOrders } from '~/features/admin/orders';
import { AdminMenu } from '~/features/admin/menu';
import { AdminMealListDetail } from '~/features/admin/meal/list/detail';
import { AdminMealSettings } from '~/features/admin/meal/settings';
import { AdminMealList } from '~/features/admin/meal/list';
import { AdminSeat } from '~/features/admin/seat';
import { Booking } from '~/features/customer/booking';
import { TakeOrders } from '~/features/customer/takeOrders';
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
    element: <ProtectedRoute />,
    path: 'admin',
    children: [
      {
        path: 'orders',
        element: <AdminOrders />,
      },
      {
        path: 'menu',
        element: <AdminMenu />,
      },
      {
        path: 'seat',
        element: <AdminSeat />,
      },
      {
        path: 'meal',
        children: [
          {
            path: 'list',
            children: [
              {
                path: '',
                element: <AdminMealList />,
              },
              {
                path: ':meal_id',
                element: <AdminMealListDetail />,
              },
            ],
          },
          {
            path: 'settings',
            element: <AdminMealSettings />,
          },
        ],
      },
    ],
  },
]);

export default router;
