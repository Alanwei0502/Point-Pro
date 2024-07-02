import { CSSProperties, FC, ReactNode } from 'react';
import Box from '@mui/material/Box';

interface ITabPanelProps {
  children: ReactNode;
  index: number | string;
  value: number | string;
  sx?: CSSProperties;
}

export const TabPanel: FC<ITabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <Box role='tabpanel' hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && children}
    </Box>
  );
};
