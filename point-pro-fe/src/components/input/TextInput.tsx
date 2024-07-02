import styled from '@emotion/styled';
import OutlinedInput from '@mui/material/OutlinedInput';

export const TextInput = styled(OutlinedInput)(() => ({
  '& > .MuiInputBase-input': {
    padding: 6,
  },
}));
