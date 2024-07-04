import { FC, useEffect } from 'react';
import { MobileLayout, MobileHeader, MobileMask } from '~/components';
import { useAppDispatch, useToken, useAppSelector } from '~/hooks';
import { DineInInfo } from './DineInInfo';
import { CategoryNavbar } from './CategoryNavbar';
import { Meals } from './Meals';
import { Footer } from './Footer';
import { CartDialog } from './dialogs/CartDialog';
import { CustomizedDialog } from './dialogs/CustomizedDialog';
import { OrdersDialog } from './dialogs/OrderDialog';
import { RemoveCartItemConfirmModal } from './modals/RemoveCartItemConfirmModal';
import { CartItemIsOffReminderModal } from './modals/CartItemIsOffReminderModal';
import { menuSliceActions } from '~/store/slices/customer/menu.slice';
import { socketSliceActions } from '~/store/slices/socket.slice';
import { orderSliceActions } from '~/store/slices/customer/order.slice';

const { getMenu } = menuSliceActions;
const { initSocket } = socketSliceActions;
const { getOrders } = orderSliceActions;

interface IMenuProps {}

const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  const { dineInToken } = useToken();

  const isConnected = useAppSelector((state) => state.socket.isConnected);
  const reservationId = useAppSelector((state) => state.dineInToken.reservationId);

  useEffect(() => {
    if (!dineInToken) return;

    dispatch(getMenu());
    dispatch(getOrders());
    dispatch(initSocket());
  }, [dineInToken, dispatch]);

  useEffect(() => {
    if (!isConnected) return;

    const { joinRoom } = socketSliceActions;
    dispatch(joinRoom(reservationId));
  }, [isConnected, reservationId, dispatch]);

  if (!dineInToken) return <MobileMask />;

  return (
    <MobileLayout>
      <MobileHeader />
      <DineInInfo />
      <CategoryNavbar />
      <Meals />
      <Footer />

      {/* 客製化、購物車、訂單畫面 */}
      <CustomizedDialog />
      <CartDialog />
      <OrdersDialog />

      {/* 提示彈窗 */}
      <RemoveCartItemConfirmModal />
      <CartItemIsOffReminderModal />
    </MobileLayout>
  );
};

export default Menu;
