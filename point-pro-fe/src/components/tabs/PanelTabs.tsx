import { CSSProperties, FC, ReactNode } from "react";
import { Box } from "@mui/material";

interface IPanelTabsProps {
  children: ReactNode;
  index: number;
  value: number | string;
  sx?: CSSProperties;
}

export const PanelTabs: FC<IPanelTabsProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && children}
    </Box>
  );
};
