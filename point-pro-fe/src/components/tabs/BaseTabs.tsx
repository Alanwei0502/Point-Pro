import { FC } from 'react';
import Tabs, { type TabsProps, tabsClasses } from '@mui/material/Tabs';
import { theme } from '~/theme';

export const BaseTabs: FC<TabsProps> = (props) => {
  const { children, ...restProps } = props;
  return (
    <Tabs
      variant='scrollable'
      sx={{
        position: 'sticky',
        top: '0',
        zIndex: '2',
        backgroundColor: theme.palette.background.paper,
        height: '48px',
        [`& .${tabsClasses.scrollButtons}.Mui-disabled`]: {
          opacity: 0.2,
        },
      }}
      {...restProps}
    >
      {children}
    </Tabs>
  );
};
