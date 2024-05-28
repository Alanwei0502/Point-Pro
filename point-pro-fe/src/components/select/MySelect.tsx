import { Select, styled } from '@mui/material';

export const MySelect = styled(Select)(() => ({
  '& > .MuiSelect-select': {
    padding: 1,
  },
}));
