import { FC } from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

export const StyleMobileButton = styled(Button)(({ theme }) => ({
  width: '100%',
  margin: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.black,
  fontWeight: 700,
  fontSize: '1.25rem',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.common.black_20,
    color: theme.palette.common.black_60,
  },
}));

export const MobileButton: FC<ButtonProps> = (props) => {
  return <StyleMobileButton {...props}>{props.children}</StyleMobileButton>;
};
