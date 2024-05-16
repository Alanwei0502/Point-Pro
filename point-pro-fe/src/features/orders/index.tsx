import { useEffect } from "react";
import { SeatInfo, CategoryNavbar, Meals, Header, Footer } from "./index.styles";
import { getMenu, getUserInfo } from "./slice";
import { getOrders } from "~/store/slices";
import {
  CartDialog,
  CustomizedDialog,
  OrdersDialog,
  PaymentModal,
  ConfirmRemoveCartItemModal,
  CounterReminderModal,
  CartItemIsOffReminderModal,
  EcPayFormModal
} from "~/components";
import { useSocket, useAppDispatch } from "~/hooks";
import { getToken } from "~/utils";
import { OrderStatus, NameSpace } from "~/types";

const Order = () => {
  const dispatch = useAppDispatch();

  useSocket({ ns: NameSpace.user });

  useEffect(() => {
    dispatch(getMenu());

    const token = getToken();
    if (token) {
      dispatch(getUserInfo());
      dispatch(getOrders({ status: OrderStatus.PENDING }));
    }
  }, []);

  return (
    <>
      <Header />
      <SeatInfo />
      <CategoryNavbar />
      <Meals />
      <Footer />

      {/* 客製化、購物車、訂單畫面 */}
      <CustomizedDialog />
      <CartDialog />
      <OrdersDialog />

      {/* 提示彈窗 */}
      <ConfirmRemoveCartItemModal />
      <PaymentModal />
      <CounterReminderModal />
      <CartItemIsOffReminderModal />
      <EcPayFormModal />
    </>
  );
};

export default Order;
