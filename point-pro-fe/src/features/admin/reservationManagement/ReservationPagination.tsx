import { FC } from 'react';
import TablePagination, { type TablePaginationProps } from '@mui/material/TablePagination';

export const ReservationTablePagination: FC<TablePaginationProps> = (props) => {
  return (
    <TablePagination
      component='div'
      count={props.count}
      page={props.page}
      labelDisplayedRows={({ page, count }) => `第 ${page + 1} 頁，共 ${count} 筆`}
      labelRowsPerPage='每頁顯示'
      rowsPerPage={props.rowsPerPage}
      rowsPerPageOptions={[5, 10, 20, 50, 100]}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
    />
  );
};
