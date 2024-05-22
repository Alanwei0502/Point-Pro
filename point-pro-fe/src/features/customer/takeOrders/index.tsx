import { FC, useEffect } from 'react';
import { MobileLayout, MobileHeader } from '~/components';
import { getMenu, getOrders, getUserInfo } from '~/store/slices';
import { useSocket, useAppDispatch } from '~/hooks';
import { getToken } from '~/utils';
import { OrderStatus, NameSpace } from '~/types';
import { SeatInfo } from './SeatInfo';
import { CategoryNavbar } from './CategoryNavbar';
import { Meals } from './Meals';
import { Footer } from './Footer';
import { CartDialog } from './CartDialog';
import { CustomizedDialog } from './CustomizedDialog';
import { OrdersDialog } from './OrderDialog';
import { ConfirmRemoveCartItemModal } from './ConfirmRemovecartItemModal';
import { PaymentModal } from './PaymentModal';
import { CounterReminderModal } from './CounterReminderModal';
import { CartItemIsOffReminderModal } from './CartItemIsOffReminderModal';
import { EcPayFormModal } from './EcPayFormModal';

interface ITakeOrdersProps {}

export const TakeOrders: FC<ITakeOrdersProps> = () => {
  const dispatch = useAppDispatch();

  useSocket({ ns: NameSpace.user });

  useEffect(() => {
    dispatch(getMenu());

    const token = getToken();

    if (token) {
      dispatch(getUserInfo());
      dispatch(getOrders({ status: OrderStatus.PENDING }));
    }
  }, [dispatch]);

  return (
    <MobileLayout>
      <MobileHeader />
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
