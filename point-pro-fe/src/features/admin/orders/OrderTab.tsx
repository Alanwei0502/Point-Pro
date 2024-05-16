import { useAppDispatch, useAppSelector } from "~/hooks/useRedux";
import { setOrderStatus } from "~/store/slices/order.slice";
import BaseTabs from "~/components/tabs/TabBase";
import theme from "~/theme";
import { OrderStatus } from "~/types/common";
import { ORDER_STATUS } from "~/utils/constants.utils";

const OrderTabs = () => {
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

export default OrderTabs;
