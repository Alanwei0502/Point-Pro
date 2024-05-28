import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { useAppDispatch } from '~/hooks';
import { getMenu } from '~/store/slices/customer/takeOrder.slice';
import { theme } from '~/theme';
import { CartList } from './index.style';
import { headerHeight, PaymentDrawer } from '~/components';
import { MenuTabs } from './MenuTabs';
import { MealDrawer } from './MealDrawer';
import { MealList } from './MenuList';

export const AdminTakeOrder = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMenu());
  }, [dispatch]);

  return (
    <>
      <Grid container sx={{ height: `calc(100vh - ${headerHeight})`, userSelect: 'none' }} bgcolor={'background.paper'}>
        <Grid item xs={8} sx={{ overflow: 'hidden' }}>
          <MenuTabs />
          <MealList />
          <MealDrawer />
        </Grid>
        <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}` }}>
          <CartList />
        </Grid>
      </Grid>
      <Grid item xs={4} sx={{ borderLeft: `1px solid ${theme.palette.common.black_40}` }}>
        <CartList />
        <PaymentDrawer />
      </Grid>
    </>
  );
};
