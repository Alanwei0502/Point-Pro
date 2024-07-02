import styled from '@emotion/styled';
import Select from '@mui/material/Select';

export const MySelect = styled(Select)(() => ({
  '& > .MuiSelect-select': {
    padding: 1,
  },
}));
