import { Button, styled } from '@mui/material';

export const BaseButton = styled(Button)(({ theme, size }) => ({
  // your custom styles go here
  fontSize: size || 14,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  '&.Mui-disabled': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
  },
}));
