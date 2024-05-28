import styled from '@emotion/styled';
import { TableCell, tableCellClasses } from '@mui/material';
import { theme } from '~/theme';

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    fontSize: 20,
    whiteSpace: 'nowrap',
  },
}));
