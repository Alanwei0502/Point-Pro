import React, { Fragment, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LabelIcon from "@mui/icons-material/Label";
import { KeyboardArrowDown } from "@mui/icons-material";
import { BaseDraw } from "~/components";
import { SideBarItemType, sideBarItemList } from "~/utils";
import { theme } from "~/theme";

interface ILeftMenuDrawerProps {
  drawerWidth: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeftMenuDrawer = (props: ILeftMenuDrawerProps) => {
  const { drawerWidth, open, setOpen } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [openList, setOpenList] = useState<{ [keyname: string]: boolean }>({});

  const handleClick = (item: SideBarItemType) => {
    if (item.path) {
      if (pathname !== item.path) {
        navigate(item.path);
      }
    } else {
      setOpenList((value) => ({ ...value, [item.id]: !value[item.id] }));
    }
  };

  return (
    <BaseDraw anchor="left" open={open} width={drawerWidth} onClose={() => setOpen(false)} hideCloseButton sx={{}}>
      <Box sx={{ overflow: "auto", height: "100%" }}>
        <List sx={{ padding: 0 }}>
          {sideBarItemList.map((item) => (
            <Fragment key={item.id}>
              <ListItem
                disablePadding
                onClick={() => handleClick(item)}
                sx={{ bgcolor: pathname === item.path ? theme.palette.primary.light : "inherit" }}
              >
                <ListItemButton>
                  <ListItemIcon>{item.src ? <item.src /> : null}</ListItemIcon>
                  <ListItemText primary={item.name} />
                  {item.list ? (
                    <KeyboardArrowDown sx={{ transform: `rotate(${openList[item.id] ? 180 : 0}deg)` }} />
                  ) : null}
                </ListItemButton>
              </ListItem>
              {item.list ? (
                openList[item.id] ? (
                  <List>
                    {item.list.map((subMenuItem) => (
                      <ListItem
                        key={subMenuItem.id}
                        disablePadding
                        onClick={() => handleClick(subMenuItem)}
                        sx={{
                          bgcolor: pathname === subMenuItem.path ? theme.palette.primary.light : "inherit"
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
                ) : null
              ) : null}
            </Fragment>
          ))}
        </List>
      </Box>
    </BaseDraw>
  );
};
