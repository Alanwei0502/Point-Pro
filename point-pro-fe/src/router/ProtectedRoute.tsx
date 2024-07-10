import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
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
        <Outlet />
      </Box>
    </Box>
  );
};

export default ProtectedRoute;
