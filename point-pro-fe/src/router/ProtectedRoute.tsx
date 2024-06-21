import { FC, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header, headerHeight } from '~/components';
import { useToken } from '~/hooks';
import Login from '~/features/admin/login';

interface IProtectedRouteProps {}
const ProtectedRoute: FC<IProtectedRouteProps> = () => {
  const { adminToken } = useToken();

  if (!adminToken) return <Login />;

  return (
    <Box position='relative' width='100%' height='100%' maxHeight='100vh' maxWidth='100vw'>
      <Header />
      <Box overflow='scroll' height={`calc(100vh - ${headerHeight})`}>
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
};

export default ProtectedRoute;
