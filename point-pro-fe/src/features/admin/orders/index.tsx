import { FC } from "react";
import { Box } from "@mui/material";
import { PaymentDrawer, AdminLayout } from "~/components";
import { OrderTabs } from "./OrderTab";
import { OrderList } from "./OrderList";

export const AdminOrders: FC = () => {
  return (
    <AdminLayout>
      <Box bgcolor={"background.paper"}>
        <OrderTabs />
        <OrderList />
        <PaymentDrawer />
      </Box>
    </AdminLayout>
  );
};
