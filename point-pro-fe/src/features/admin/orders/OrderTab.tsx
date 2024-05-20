import { FC } from "react";
import { useAppDispatch, useAppSelector } from "~/hooks";
import { setOrderStatus } from "~/store/slices";
import { BaseTabs } from "~/components";
import { theme } from "~/theme";
import { OrderStatus } from "~/types";
import { ORDER_STATUS } from "~/utils";

export const OrderTabs: FC = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(({ order }) => order.status);

  const handleSelected = (orderStatus: OrderStatus) => {
    dispatch(setOrderStatus(orderStatus));
  };

  return (
    <BaseTabs
      sx={{
        position: "sticky",
        top: "0",
        zIndex: "10",
        backgroundColor: theme.palette.background.paper,
        height: "54px"
      }}
      tabs={ORDER_STATUS}
      onChange={(_, value) => handleSelected(value as OrderStatus)}
      value={status}
    />
  );
};
