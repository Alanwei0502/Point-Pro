import { FC, useEffect } from 'react';
import { MobileLayout, MobileHeader, MobileMask, MobileLoading } from '~/components';
import { getMenu } from '~/store/slices';
import { useSocket, useAppDispatch, useToken, useAppSelector } from '~/hooks';
import { NameSpace } from '~/types';
import { DineInInfo } from './DineInInfo';
import { CategoryNavbar } from './CategoryNavbar';
import { Meals } from './Meals';
import { Footer } from './Footer';
import { CartDialog } from './dialogs/CartDialog';
import { CustomizedDialog } from './dialogs/CustomizedDialog';
import { OrdersDialog } from './dialogs/OrderDialog';
import { RemoveCartItemConfirmModal } from './modals/RemoveCartItemConfirmModal';
import { CartItemIsOffReminderModal } from './modals/CartItemIsOffReminderModal';

interface IMenuProps {}

export const Menu: FC<IMenuProps> = () => {
  const dispatch = useAppDispatch();

  const token = useToken();

  const isLoading = useAppSelector((state) => state.menu.isLoading);

  // useSocket({ ns: NameSpace.user });

  useEffect(() => {
    if (!token) return;
    dispatch(getMenu());
  }, [token, dispatch]);

  if (!token) return <MobileMask />;

  if (isLoading) return <MobileLoading />;

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
