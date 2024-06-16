import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header, headerHeight, AdminLoginLoading } from '~/components';
import { useSocket, useToken } from '~/hooks';
import { NameSpace } from '~/types';

export const ProtectedRoute = () => {
  const location = useLocation();

  useSocket({ ns: NameSpace.admin });

  const token = useToken();

  if (!token) {
    return <Navigate to='.' replace state={{ from: location }} />;
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '100vw', height: '100%', maxHeight: '100vh' }}>
      <AdminLoginLoading />
      <Header />
      <Box sx={{ height: `calc(100vh - ${headerHeight})`, overflow: 'scroll' }}>
        <Outlet />
      </Box>
    </Box>
  );
};
