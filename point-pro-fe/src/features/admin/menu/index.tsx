import { useEffect } from "react";
import { Grid } from "@mui/material";
import { useAppDispatch } from "~/hooks";
import { getMenu } from "~/features/orders/slice";
import { theme } from "~/theme";
import { CartList, MealList, MenuTabs, MealDrawer } from "./index.style";
import { headerHeight, PaymentDrawer, AdminLayout } from "~/components";

export const AdminMenu = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMenu());
  }, []);

  return (
    <AdminLayout>
      <Grid container sx={{ height: `calc(100vh - ${headerHeight})`, userSelect: "none" }} bgcolor={"background.paper"}>
        <Grid item xs={8} sx={{ overflow: "hidden" }}>
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
    </AdminLayout>
  );
};
