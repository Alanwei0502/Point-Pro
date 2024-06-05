import { FC, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useAppDispatch } from '~/hooks';
import { takeOrderSliceActions } from '~/store/slices';
import { theme } from '~/theme';
import { headerHeight, PaymentDrawer } from '~/components';
import { Menu } from './Menu';
import { MealDrawer } from './MealDrawer';
import { CartList } from './CartList';
import { ClearCartConfirmModal } from './modals/ClearCartConfirmModal';
import { SubmitCartConfirmModal } from './modals/SubmitCartConfirmModal';

const { getAdminMenu, resetTakeOrderState } = takeOrderSliceActions;

interface IAdminTakeOrderProps {}

export const AdminTakeOrder: FC<IAdminTakeOrderProps> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAdminMenu());

    return () => {
      dispatch(resetTakeOrderState());
    };
  }, [dispatch]);

  return (
    <>
      <Grid container sx={{ height: `calc(100vh - ${headerHeight})`, userSelect: 'none' }} bgcolor={'background.paper'}>
        <Grid item xs={8} sx={{ overflow: 'hidden' }}>
          <Menu />
          <MealDrawer />
        </Grid>
        <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}` }}>
          <CartList />
        </Grid>
      </Grid>
      {/* <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}` }}>
        <CartList />
        <PaymentDrawer />
      </Grid> */}
      <ClearCartConfirmModal />
      <SubmitCartConfirmModal />
    </>
  );
};
