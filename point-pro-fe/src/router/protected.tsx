import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header, headerHeight } from '~/components';
import { AdminLoginLoading } from '~/components/loading/AdminLoginLoading';
import { useAppSelector, useSocket } from '~/hooks';
import { NameSpace } from '~/types';
import { getToken } from '~/utils';

export const ProtectedRoute = () => {
  const location = useLocation();

  // const authToken = useAppSelector(({ auth }) => auth.authToken);

  useSocket({ ns: NameSpace.admin });

  const token = getToken();

  console.log({ token });

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
