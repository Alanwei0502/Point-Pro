import { BrowserRouter, Navigate, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import { Home } from '~/features/home';
import { Login } from '~/features/admin/login';
import { ProtectedRoute } from './ProtectedRoute';
import { OrderManagement } from '~/features/admin/orderManagement';
import { TakeOrder } from '~/features/admin/takeOrder';
import { MenuManagement } from '~/features/admin/menuManagement';
import { ReservationManagement } from '~/features/admin/reservationManagement';
import { Booking } from '~/features/customer/booking';
import { Menu } from '~/features/customer/menu';
// import { PaymentCancel, PaymentConfirm } from '~/features/customer/payment';
import { pathObj } from '~/components';
import { Box } from '@mui/material';

export const App = () => {
  const router = createBrowserRouter(
    [
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
            path: pathObj.reservationMangement,
            element: <ReservationManagement />,
          },
          {
            path: pathObj.menuManagement,
            element: <MenuManagement />,
          },
        ],
      },
      {
        path: `${pathObj.admin}/*`,
        element: <Navigate to='.' replace />,
      },
    ],
    {
      basename: '/',
    },
  );

  // return <RouterProvider router={router} />;

  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route index element={<Home />} />
        <Route path={pathObj.booking} element={<Booking />} />
        <Route path={pathObj.menu} element={<Menu />} />
        {/* <Route path={pathObj.payment} /> */}
        <Route path={pathObj.admin} element={<Login />} />
        <Route path={pathObj.admin} element={<ProtectedRoute />}>
          <Route path={pathObj.orderManagement} element={<OrderManagement />} />
          <Route path={pathObj.takeOrder} element={<TakeOrder />} />
          <Route path={pathObj.menuManagement} element={<MenuManagement />} />
          <Route path={pathObj.reservationMangement} element={<ReservationManagement />} />
          <Route
            path='*'
            element={
              <Box display='flex' height='100%' alignItems='center' justifyContent='center'>
                無此頁面
              </Box>
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  );
};
