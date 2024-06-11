import { FC, useEffect } from 'react';
import { MobileLayout, MobileHeader } from '~/components';
import { getMenu, getOrders } from '~/store/slices';
import { useSocket, useAppDispatch, useToken } from '~/hooks';
import { OrderStatus, NameSpace } from '~/types';
import { SeatInfo } from './SeatInfo';
import { CategoryNavbar } from './CategoryNavbar';
import { Meals } from './Meals';
import { Footer } from './Footer';
import { CartDialog } from './dialogs/CartDialog';
import { CustomizedDialog } from './dialogs/CustomizedDialog';
import { OrdersDialog } from './dialogs/OrderDialog';
import { ConfirmRemoveCartItemModal } from './modals/ConfirmRemovecartItemModal';
import { PaymentModal } from './modals/PaymentModal';
import { CounterReminderModal } from './modals/CounterReminderModal';
import { CartItemIsOffReminderModal } from './modals/CartItemIsOffReminderModal';
import { EcPayFormModal } from './modals/EcPayFormModal';
import MobileMask from '~/components/mask/MobileMask';

interface IMenuProps {}

export const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  // useSocket({ ns: NameSpace.user });
  const token = useToken();

  useEffect(() => {
    if (token) {
      dispatch(getMenu());
      // TODO: getReservation
      // dispatch(getUserInfo());
      // dispatch(getOrders({ status: OrderStatus.WORKING }));
    }
  }, [token, dispatch]);

  return token ? (
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
  ) : (
    <MobileMask />
  );
};
