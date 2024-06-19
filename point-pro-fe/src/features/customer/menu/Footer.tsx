import { FC, SyntheticEvent, useMemo } from 'react';
import { BottomNavigation, BottomNavigationAction, BottomNavigationActionProps, Box, styled } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import CartIcon from '@mui/icons-material/ShoppingCart';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { openDialog } from '~/store/slices';
import { OrderStatus, MobileDialog } from '~/types';

const StyledBottomNavigationAction = styled(BottomNavigationAction)<BottomNavigationActionProps & { amount?: number }>(({ theme, amount }) => ({
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
  const unPaidOrderAmount = useMemo(
    () => orders.filter(({ status }) => status === OrderStatus.FINISHED || status === OrderStatus.WORKING).length,
    [orders],
  );

  const handleClickFooter = (e: SyntheticEvent<Element, Event>, type: MobileDialog) => {
    if (type) dispatch(openDialog({ type }));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '5px',
        borderRadius: '.6rem',
        height: '4.5rem',
        display: 'flex',
        width: '14rem',
        bgcolor: 'common.white',
      }}
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
        <StyledBottomNavigationAction label='訂單' value={MobileDialog.ORDER} icon={<StickyNote2Icon />} amount={unPaidOrderAmount} />
      </BottomNavigation>
    </Box>
  );
};
