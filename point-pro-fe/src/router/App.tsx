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
import { Box } from '@mui/material';
import { ROUTE_PATH } from '~/utils';

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
          path: ROUTE_PATH.payment,
          children: [
            // {
            //   path: ROUTE_PATH.confirm,
            //   element: <PaymentConfirm />,
            // },
            // {
            //   path: ROUTE_PATH.cancel,
            //   element: <PaymentCancel />,
            // },
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
          ],
        },
        {
          path: `${ROUTE_PATH.admin}/*`,
          element: <Navigate to='.' replace />,
        },
      ],
    },
    // {
    //   path: ROUTE_PATH.booking,
    //   element: <Booking />,
    // },
    // {
    //   path: ROUTE_PATH.menu,
    //   element: <Menu />,
    // },
    // {
    //   path: ROUTE_PATH.payment,
    //   children: [
    //     // {
    //     //   path: ROUTE_PATH.confirm,
    //     //   element: <PaymentConfirm />,
    //     // },
    //     // {
    //     //   path: ROUTE_PATH.cancel,
    //     //   element: <PaymentCancel />,
    //     // },
    //   ],
    // },
    // Admin
    // {
    //   path: ROUTE_PATH.admin,
    //   element: <Login />,
    // },
    // {
    //   path: ROUTE_PATH.admin,
    //   element: <ProtectedRoute />,
    //   children: [
    //     {
    //       path: ROUTE_PATH.orderManagement,
    //       element: <OrderManagement />,
    //     },
    //     {
    //       path: ROUTE_PATH.takeOrder,
    //       element: <TakeOrder />,
    //     },
    //     {
    //       path: ROUTE_PATH.reservationMangement,
    //       element: <ReservationManagement />,
    //     },
    //     {
    //       path: ROUTE_PATH.menuManagement,
    //       element: <MenuManagement />,
    //     },
    //   ],
    // },
    // {
    //   path: `${ROUTE_PATH.admin}/*`,
    //   element: <Navigate to='.' replace />,
    // },
  ],
  {
    basename: '/',
  },
);

export const App = () => {
  return <RouterProvider router={router} />;

  // return (
  //   <BrowserRouter basename='/'>
  //     <Routes>
  //       <Route index element={<Home />} />
  //       <Route path={ROUTE_PATH.booking} element={<Booking />} />
  //       <Route path={ROUTE_PATH.menu} element={<Menu />} />
  //       {/* <Route path={ROUTE_PATH.payment} /> */}
  //       <Route path={ROUTE_PATH.admin} element={<Login />} />
  //       <Route path={ROUTE_PATH.admin} element={<ProtectedRoute />}>
  //         <Route path={ROUTE_PATH.orderManagement} element={<OrderManagement />} />
  //         <Route path={ROUTE_PATH.takeOrder} element={<TakeOrder />} />
  //         <Route path={ROUTE_PATH.menuManagement} element={<MenuManagement />} />
  //         <Route path={ROUTE_PATH.reservationMangement} element={<ReservationManagement />} />
  //         <Route
  //           path='*'
  //           element={
  //             <Box display='flex' height='100%' alignItems='center' justifyContent='center'>
  //               無此頁面
  //             </Box>
  //           }
  //         />
  //       </Route>
  //       <Route path='*' element={<Navigate to='/' replace />} />
  //     </Routes>
  //   </BrowserRouter>
  // );
};
