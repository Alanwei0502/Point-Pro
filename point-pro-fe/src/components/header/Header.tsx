import { useState, useEffect, FC } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Badge, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { DoubleArrow, NotificationsNone, PowerSettingsNew } from '@mui/icons-material';
import HeaderLogo from '~/assets/images/header-logo.svg';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { appDayjs, dateForm } from '~/utils';
import { theme } from '~/theme';
import { LeftMenuDrawer, NotificationDrawer, sideBarItemList } from '~/components';
import { getCategories, getMeals, getSpecialties } from '~/store/slices';

const drawerWidth = '300px';
export const headerHeight = '72px';

const flatSideBarItemList = sideBarItemList.flatMap((item) => {
  return item.list ? item.list : item;
});

interface IHeaderProps {}

export const Header: FC<IHeaderProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { meal_id } = useParams();

  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showTime, setShowTime] = useState(appDayjs().format(dateForm.fullDateWithSecond));

  const notifications = useAppSelector(({ socket }) => socket.notifications);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getMeals());
    dispatch(getSpecialties());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTime(appDayjs().format(dateForm.fullDateWithSecond));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate({ pathname: '/admin' });
  };

  const pageTitle = () => {
    const routerInfo = flatSideBarItemList.find((item) => item.path === location.pathname) ?? null;
    if (routerInfo?.name) {
      return routerInfo.name;
    } else {
      return meal_id === 'create' ? '新增菜單' : '編輯菜單';
    }
  };

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
          },
        }}
      >
        <Toolbar>
          {/* logo */}
          <Button
            onClick={() => setIsLeftMenuOpen((val) => !val)}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              width: isLeftMenuOpen ? drawerWidth : '112px',
              p: 2,
              // pl: 2,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              borderRadius: 0,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: '225ms cubic-bezier(0, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.main,
              },
            }}
          >
            <Box component='img' src={HeaderLogo} sx={{ width: '40px', height: '40px' }} />
            <Box
              component='div'
              sx={{
                textAlign: 'left',
                position: 'absolute',
                left: '80px',
                top: '13%',
                opacity: isLeftMenuOpen ? 1 : 0,
                transiton: 'opacity 225ms',
              }}
            >
              <Typography variant='h5' color={theme.palette.common.black} fontWeight={900} lineHeight={1}>
                港都熱炒
              </Typography>
              <Typography variant='tiny' color={theme.palette.common.black}>
                Point Pro 餐飲系統
              </Typography>
            </Box>
            <DoubleArrow
              color='secondary'
              sx={{
                ml: 1,
                width: '24px',
                height: '24px',
                color: (theme) => theme.palette.common.black,
                transition: '0.5s cubic-bezier(0, 0, 0.2, 1) ',
                transform: `rotateY(${isLeftMenuOpen ? 180 : 0}deg)`,
              }}
            />
          </Button>

          {/* page title */}
          <Typography variant='h2' sx={{ flexGrow: 1, pl: 2 }}>
            {pageTitle()}
          </Typography>
          <Typography sx={{ pr: 2 }}>{showTime}</Typography>

          {/* action icon */}
          <Box
            sx={{
              px: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <IconButton color='inherit' onClick={() => setIsNotificationOpen(true)}>
              <Badge badgeContent={notifications.length} color='error'>
                <NotificationsNone sx={{ width: 30, height: 30 }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleLogout} color='inherit' edge='end'>
              <PowerSettingsNew sx={{ width: 30, height: 30 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* drawers */}
      <LeftMenuDrawer drawerWidth={drawerWidth} open={isLeftMenuOpen} setOpen={setIsLeftMenuOpen} />
      <NotificationDrawer open={isNotificationOpen} setOpen={setIsNotificationOpen} />
    </>
  );
};
