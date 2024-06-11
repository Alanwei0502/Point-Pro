import { FC, useEffect } from 'react';
import { Box } from '@mui/material';
import { theme } from '~/theme';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { useAppDispatch, useAppSelector } from '~/hooks';
import {
  adminLoadingSliceActions,
  getCategories,
  getMeals,
  getSpecialties,
  orderManagementSliceActions,
  takeOrderSliceActions,
} from '~/store/slices';
import { toast } from 'react-toastify';

const { getAdminMenu } = takeOrderSliceActions;
const { getAllOrders } = orderManagementSliceActions;
const { openAdminLoginLoading, closeAdminLoginLoading } = adminLoadingSliceActions;

interface IAdminLoginLoadingProps {}

export const AdminLoginLoading: FC<IAdminLoginLoadingProps> = () => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector((state) => state.adminLoading.loginLoading.isOpen);

  // initial data
  useEffect(() => {
    dispatch(openAdminLoginLoading());
    Promise.allSettled([
      dispatch(getAdminMenu()).unwrap(),
      dispatch(getCategories()).unwrap(),
      dispatch(getMeals()).unwrap(),
      dispatch(getSpecialties()).unwrap(),
      dispatch(getAllOrders()).unwrap(),
    ])
      .then(() => {
        dispatch(closeAdminLoginLoading());
      })
      .catch(() => {
        toast.error('系統錯誤，請重新整理頁面');
      });
  }, [dispatch]);

  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.main,
        zIndex: theme.zIndex.modal + 1,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        display: isOpen ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component='img'
        src={HeaderLogo}
        width={100}
        sx={{
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%': {
              transform: 'rotateY(0deg)',
            },
            '100%': {
              transform: 'rotateY(360deg)',
            },
          },
        }}
      />
    </Box>
  );
};
