import { Box } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Header, headerHeight } from '~/components';
import { useAppSelector, useSocket } from '~/hooks';
import { NameSpace } from '~/types';
import { getToken } from '~/utils';

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  const token = getToken();

  useSocket({ ns: NameSpace.admin });

  return (isAuthenticated || token) && location.pathname !== '/admin' ? (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '100vw', height: '100%', maxHeight: '100vh' }}>
      <Header />
      <Box sx={{ height: `calc(100vh - ${headerHeight})`, overflow: 'scroll' }}>
        <Outlet />
      </Box>
    </Box>
  ) : (
    <Navigate to='/admin' state={{ from: location }} replace />
  );
};
