import { FC, useEffect } from "react";
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
  EcPayFormModal,
  MobileLayout
} from "~/components";
import { useSocket, useAppDispatch } from "~/hooks";
import { getToken } from "~/utils";
import { OrderStatus, NameSpace } from "~/types";

interface IOrderProps {}

export const Order: FC<IOrderProps> = () => {
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
    <MobileLayout>
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
    </MobileLayout>
  );
};
