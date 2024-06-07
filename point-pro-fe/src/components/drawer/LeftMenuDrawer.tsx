import React, { Fragment, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import { KeyboardArrowDown } from '@mui/icons-material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { BaseDraw } from '~/components';
import { theme } from '~/theme';

export const pathObj = {
  booking: 'booking',
  payment: 'payment',
  confirm: 'confirm',
  cancel: 'cancel',
  admin: 'admin',
  orderManagement: 'order_management',
  menu: 'menu',
  takeOrder: 'take_order',
  seat: 'seat',
  menuSetting: 'menu_setting',
};

interface ISideBarItem {
  id: string;
  name: string;
  src: React.ElementType;
  path: string;
  list: ISideBarItem[];
}

export const sideBarItemList: ISideBarItem[] = [
  {
    id: pathObj.takeOrder,
    name: '點餐系統',
    src: RestaurantMenuIcon,
    path: `/${pathObj.admin}/${pathObj.takeOrder}`,
    list: [],
  },
  {
    id: pathObj.orderManagement,
    name: '訂單系統',
    src: StickyNote2Icon,
    path: `/${pathObj.admin}/${pathObj.orderManagement}`,
    list: [],
  },
  {
    id: pathObj.seat,
    name: '座位系統',
    src: EventSeatIcon,
    path: `/${pathObj.admin}/${pathObj.seat}`,
    list: [],
  },
  {
    id: pathObj.menuSetting,
    name: '菜單系統',
    src: MenuBookIcon,
    path: `/${pathObj.admin}/${pathObj.menuSetting}`,
    list: [],
  },
];

interface ILeftMenuDrawerProps {
  drawerExpandWidth: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeftMenuDrawer = (props: ILeftMenuDrawerProps) => {
  const { drawerExpandWidth, open, setOpen } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openList, setOpenList] = useState<{ [key: string]: boolean }>({});

  const handleClick = (item: ISideBarItem) => {
    if (item.path) {
      if (pathname !== item.path) {
        navigate(item.path);
        setOpen((prev) => !prev);
      }
    } else {
      setOpenList((value) => ({ ...value, [item.id]: !value[item.id] }));
    }
  };

  return (
    <BaseDraw anchor='left' open={open} width={drawerExpandWidth} onClose={() => setOpen(false)} hideCloseButton>
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        <List sx={{ padding: 0 }}>
          {sideBarItemList.map((item) => (
            <Fragment key={item.id}>
              <ListItem
                disablePadding
                onClick={() => handleClick(item)}
                sx={{ bgcolor: pathname === item.path ? theme.palette.primary.light : 'inherit' }}
              >
                <ListItemButton>
                  <ListItemIcon>{item.src ? <item.src /> : null}</ListItemIcon>
                  <ListItemText primary={item.name} />
                  {item.list.length > 0 && <KeyboardArrowDown sx={{ transform: `rotate(${openList[item.id] ? 180 : 0}deg)` }} />}
                </ListItemButton>
              </ListItem>
              {item.list.length > 0 && openList[item.id] && (
                <List>
                  {item.list.map((subMenuItem) => (
                    <ListItem
                      key={subMenuItem.id}
                      disablePadding
                      onClick={() => handleClick(subMenuItem)}
                      sx={{
                        bgcolor: pathname === subMenuItem.path ? theme.palette.primary.light : 'inherit',
                      }}
                    >
                      <ListItemButton sx={{ pl: 9 }}>
                        <ListItemIcon>
                          <LabelIcon />
                        </ListItemIcon>
                        <ListItemText primary={subMenuItem.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Fragment>
          ))}
        </List>
      </Box>
    </BaseDraw>
  );
};
