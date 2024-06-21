import { useState, useEffect, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Box, Button, Badge, AppBar, Toolbar, IconButton, Typography, Divider } from '@mui/material';
import { DoubleArrow, NotificationsNone, PowerSettingsNew } from '@mui/icons-material';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { useAppDispatch, useAppSelector, useInititalize } from '~/hooks';
import { theme } from '~/theme';
import { LeftMenuDrawer, NotificationDrawer, PaymentModal, sideBarItemList, LinePayModal, ConfirmCloseLinePayModal } from '~/components';
import { adminUISliceActions, authSliceActions } from '~/store/slices';
import { ROUTE_PATH } from '~/utils';

const drawerExpandWidth = '250px';
const drawerCollapseWidth = '100px';
export const headerHeight = '60px';

interface INotificationButtonProps {}
const NotificationButton: FC<INotificationButtonProps> = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notifications = useAppSelector(({ socket }) => socket.notifications);
  return (
    <IconButton color='inherit' onClick={() => setIsNotificationOpen(true)}>
      <Badge badgeContent={notifications.length} color='error'>
        <NotificationsNone sx={{ width: 30, height: 30 }} />
      </Badge>
    </IconButton>
  );
};

interface ILogoutButtonProps {}
const LogoutButton: FC<ILogoutButtonProps> = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    const { logout } = authSliceActions;
    toast.promise(
      async () => {
        await dispatch(logout()).unwrap();
        navigate(`../${ROUTE_PATH.admin}`);
      },
      {
        pending: '登出中...',
        success: '已登出',
        error: '登出失敗',
      },
    );
  };
  return (
    <IconButton onClick={handleLogout} color='inherit' edge='end'>
      <PowerSettingsNew sx={{ width: 30, height: 30 }} />
    </IconButton>
  );
};

interface IClockTimeProps {}
const ClockTime: FC<IClockTimeProps> = () => {
  const dispatch = useAppDispatch();
  const clock = useAppSelector((state) => state.adminUI.clock);
  useEffect(() => {
    const { setClock } = adminUISliceActions;
    const interval = setInterval(() => {
      dispatch(setClock());
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);
  return <Typography sx={{ pr: 2 }}>{clock}</Typography>;
};

interface IHeaderProps {}
export const Header: FC<IHeaderProps> = () => {
  const location = useLocation();

  useInititalize();

  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);

  const flatSideBarItemList = sideBarItemList.flatMap((item) => (item.list.length ? item.list : item));

  const routerInfo = flatSideBarItemList.find((item) => item.path === location.pathname);

  return (
    <>
      {/* header */}
      <AppBar
        position='sticky'
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.drawer + 100,
          borderBottom: 0.5,
          borderColor: 'divider',
          boxShadow: 'none',
          height: headerHeight,
          userSelect: 'none',
          '& .MuiToolbar-root': {
            padding: 0,
            minHeight: headerHeight,
          },
        }}
      >
        <Toolbar>
          {/* logo */}
          <Button
            onClick={() => setIsLeftMenuOpen((val) => !val)}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              width: isLeftMenuOpen ? drawerExpandWidth : drawerCollapseWidth,
              height: headerHeight,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: '225ms cubic-bezier(0, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <Box component='img' src={HeaderLogo} width='45px' height='45px' />
            <Box
              sx={{
                textAlign: 'left',
                display: isLeftMenuOpen ? 'block' : 'none',
              }}
            >
              <Typography variant='h6' color={theme.palette.common.black} fontWeight={900} lineHeight={1}>
                港都熱炒
              </Typography>
              <Typography variant='tiny' color={theme.palette.common.black}>
                Point Pro 餐飲系統
              </Typography>
            </Box>
            <DoubleArrow
              color='secondary'
              sx={{
                width: '24px',
                height: '24px',
                color: (theme) => theme.palette.common.black,
                transition: '0.5s cubic-bezier(0, 0, 0.2, 1) ',
                transform: `rotateY(${isLeftMenuOpen ? 180 : 0}deg)`,
              }}
            />
          </Button>

          {/* page title */}
          <Typography variant='h3' sx={{ flexGrow: 1, pl: 2 }}>
            {routerInfo?.name ?? '未知頁面'}
          </Typography>
          <ClockTime />

          <Divider orientation='vertical' />

          {/* action icon */}
          <Box px={2} display='flex' alignItems='center' gap={2}>
            <NotificationButton />
            <LogoutButton />
          </Box>
        </Toolbar>
      </AppBar>

      {/* drawers */}
      <LeftMenuDrawer drawerExpandWidth={drawerExpandWidth} open={isLeftMenuOpen} setOpen={setIsLeftMenuOpen} />
      {/* <NotificationDrawer open={isNotificationOpen} setOpen={setIsNotificationOpen} /> */}

      {/* Modal */}
      <PaymentModal />
      <LinePayModal />
      <ConfirmCloseLinePayModal />
    </>
  );
};
