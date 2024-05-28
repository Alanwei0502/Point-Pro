import { Button, ButtonProps, styled } from '@mui/material';

export const BaseButton = styled(Button)<ButtonProps>(({ theme, size }) => ({
  // your custom styles go here
  fontSize: size || 14,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  '&.Mui-disabled': {
    color: theme.palette.common.black_80,
    backgroundColor: theme.palette.common.black_40,
  },
}));
