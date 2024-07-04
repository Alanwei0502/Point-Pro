import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { BaseDraw } from '~/components';
import { theme } from '~/theme';
import { ROUTE_PATH } from '~/constants';

interface ISideBarItem {
  id: string;
  name: string;
  src: React.ElementType;
  path: string;
  list: ISideBarItem[];
}

export const sideBarItemList: ISideBarItem[] = [
  {
    id: ROUTE_PATH.takeOrder,
    name: '點餐系統',
    src: RestaurantMenuIcon,
    path: `/${ROUTE_PATH.admin}/${ROUTE_PATH.takeOrder}`,
    list: [],
  },
  {
    id: ROUTE_PATH.orderManagement,
    name: '訂單系統',
    src: StickyNote2Icon,
    path: `/${ROUTE_PATH.admin}/${ROUTE_PATH.orderManagement}`,
    list: [],
  },
  {
    id: ROUTE_PATH.reservationMangement,
    name: '預約系統',
    src: EventSeatIcon,
    path: `/${ROUTE_PATH.admin}/${ROUTE_PATH.reservationMangement}`,
    list: [],
  },
  {
    id: ROUTE_PATH.menuManagement,
    name: '菜單系統',
    src: MenuBookIcon,
    path: `/${ROUTE_PATH.admin}/${ROUTE_PATH.menuManagement}`,
    list: [],
  },
];

interface ILeftMenuDrawerProps {
  drawerExpandWidth: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeftMenuDrawer: FC<ILeftMenuDrawerProps> = (props) => {
  const { drawerExpandWidth, open, setOpen } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = (item: ISideBarItem) => {
    if (item.path && pathname !== item.path) {
      setOpen((prev) => !prev);
      navigate(item.path);
    }
  };

  return (
    <BaseDraw anchor='left' open={open} width={drawerExpandWidth} onClose={() => setOpen(false)} hideCloseButton>
      <Box overflow='auto' height='100%'>
        <List disablePadding>
          {sideBarItemList.map((item) => (
            <ListItem
              disablePadding
              key={item.id}
              onClick={() => handleClick(item)}
              sx={{ bgcolor: pathname === item.path ? theme.palette.primary.light : 'inherit' }}
            >
              <ListItemButton>
                <ListItemIcon>{item.src ? <item.src /> : null}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </BaseDraw>
  );
};
