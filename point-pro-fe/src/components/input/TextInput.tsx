import { OutlinedInput, styled } from '@mui/material';

export const TextInput = styled(OutlinedInput)(({ theme }) => ({
  '& > .MuiInputBase-input': {
    padding: 2,
  },
}));
