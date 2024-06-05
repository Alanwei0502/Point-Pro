import { FC } from 'react';
import { Tab, TabProps } from '@mui/material';
import { theme } from '~/theme';

export const BaseTab: FC<TabProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <Tab
      sx={{
        fontSize: 18,
        color: 'common.black_80',
        '&.Mui-selected': {
          fontWeight: 900,
          color: 'common.black',
        },
        '&.Mui-focusVisible': {
          backgroundColor: 'common.black',
        },
      }}
      {...restProps}
    >
      {children}
    </Tab>
  );
};
