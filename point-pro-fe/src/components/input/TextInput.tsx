import { OutlinedInput, styled } from '@mui/material';

export const TextInput = styled(OutlinedInput)(() => ({
  '& > .MuiInputBase-input': {
    padding: 6,
  },
}));
