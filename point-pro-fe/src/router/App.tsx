import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { theme } from '~/theme';
import { store } from '~/store/store';
import { pathObj } from '~/components';
import { Home } from '~/features/home';
import { Booking } from '~/features/customer/booking';
import { Menu } from '~/features/customer/menu';
import { Login } from '~/features/admin/login';
import { OrderManagement } from '~/features/admin/orderManagement';
import { TakeOrder } from '~/features/admin/takeOrder';
import { MenuManagement } from '~/features/admin/menuManagement';
import { ReservationManagement } from '~/features/admin/reservationManagement';
import { ProtectedRoute } from './protected';

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path={pathObj.booking} element={<Booking />} />
            <Route path={pathObj.menu} element={<Menu />} />
            {/* <Route path={pathObj.payment} /> */}
            <Route path={pathObj.admin} element={<Login />} />
            <Route path={pathObj.admin} element={<ProtectedRoute />}>
              <Route path={pathObj.orderManagement} element={<OrderManagement />} />
              <Route path={pathObj.takeOrder} element={<TakeOrder />} />
              <Route path={pathObj.menuManagement} element={<MenuManagement />} />
              <Route path={pathObj.reservationMangement} element={<ReservationManagement />} />
            </Route>
            <Route path='/*' element={<Navigate to='/' replace />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};
