import { FC, useEffect, useState } from 'react';
import { MobileLayout, MobileHeader, MobileMask, MobileLoading } from '~/components';
import { getMenu, getOrders } from '~/store/slices';
import { useSocket, useAppDispatch, useToken } from '~/hooks';
import { OrderStatus, NameSpace } from '~/types';
import { UserInfo } from './UserInfo';
import { CategoryNavbar } from './CategoryNavbar';
import { Meals } from './Meals';
import { Footer } from './Footer';
import { CartDialog } from './dialogs/CartDialog';
import { CustomizedDialog } from './dialogs/CustomizedDialog';
import { OrdersDialog } from './dialogs/OrderDialog';
import { ConfirmRemoveCartItemModal } from './modals/ConfirmRemoveCartItemModal';
import { PaymentModal } from './modals/PaymentModal';
import { CounterReminderModal } from './modals/CounterReminderModal';
import { CartItemIsOffReminderModal } from './modals/CartItemIsOffReminderModal';
import { EcPayFormModal } from './modals/EcPayFormModal';

interface IMenuProps {}

export const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  // useSocket({ ns: NameSpace.user });
  const token = useToken();

  useEffect(() => {
    if (!token) return;

    setIsLoading(true);
    (async () => {
      Promise.all([dispatch(getMenu()), dispatch(getOrders())]).finally(() => {
        setIsLoading(false);
      });
    })();
  }, [token, dispatch]);

  if (!token) return <MobileMask />;

  if (isLoading) return <MobileLoading />;

  return (
    <MobileLayout>
      <MobileHeader />
      <UserInfo />
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
