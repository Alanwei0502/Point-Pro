import { FC, SyntheticEvent, useMemo } from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction, { type BottomNavigationActionProps } from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import styled from '@emotion/styled';
import { theme } from '~/theme';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CartIcon from '@mui/icons-material/ShoppingCart';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { OrderStatus, MobileDialog } from '~/types';
import { menuSliceActions } from '~/store/slices/customer/menu.slice';

const { openDialog } = menuSliceActions;

const StyledBottomNavigationAction = styled(BottomNavigationAction)<BottomNavigationActionProps & { amount?: number }>(({ amount }) => ({
  borderRadius: '.6rem',
  minWidth: 'auto',
  padding: '0',
  gap: '.3rem',
  backgroundColor: theme.palette.common.black_20,
  '&:focus': { outline: 'none' },
  '&.Mui-selected': { color: '#F0F0F0' },
  '&.MuiBottomNavigationAction-root::after': {
    content: `"${amount}"`,
    display: `${amount ? 'flex' : 'none'}`,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '1.5rem',
    height: '1.5rem',
    fontSize: 'small.fontSize',
    color: theme.palette.common.black,
    borderRadius: '0 .6rem 0 0',
    backgroundColor: theme.palette.primary.main,
  },
}));

interface IFooterProps {}

export const Footer: FC<IFooterProps> = () => {
  const dispatch = useAppDispatch();

  const dialogType = useAppSelector((state) => state.menu.dialog.type);
  const cart = useAppSelector((state) => state.menu.cart);
  const orders = useAppSelector(({ order }) => order.orders);

  const cartAmount = useMemo(() => cart.reduce((acc, item) => (acc += item.amount), 0), [cart]);

  const orderAmount = useMemo(() => orders.filter((o) => o.status !== OrderStatus.CANCEL).length, [orders]);

  const handleClickFooter = (e: SyntheticEvent<Element, Event>, type: MobileDialog) => {
    if (type) dispatch(openDialog({ type }));
  };

  return (
    <Box
      position='fixed'
      bottom='.5rem'
      left='50%'
      p={0.5}
      borderRadius={2}
      height={70}
      display='flex'
      width='14rem'
      bgcolor='common.white'
      sx={{ transform: 'translateX(-50%)' }}
    >
      <BottomNavigation
        showLabels
        value={dialogType}
        onChange={handleClickFooter}
        sx={{
          gap: '5px',
          height: '100%',
          width: '100%',
          bgcolor: 'common.white',
          '& .Mui-selected': { bgcolor: 'common.black' },
          '& .MuiSvgIcon-root': { fontSize: 'body1.fontSize' },
        }}
      >
        <StyledBottomNavigationAction label='菜單' value='' icon={<RestaurantMenuIcon />} />
        <StyledBottomNavigationAction label='購物車' value={MobileDialog.CART} icon={<CartIcon />} amount={cartAmount} />
        <StyledBottomNavigationAction label='點餐紀錄' value={MobileDialog.ORDER} icon={<StickyNote2Icon />} amount={orderAmount} />
      </BottomNavigation>
    </Box>
  );
};
