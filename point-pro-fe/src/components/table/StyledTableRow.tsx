import styled from '@emotion/styled';
import { TableRow } from '@mui/material';
import { theme } from '~/theme';

export const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.background.paper,
  },
}));
