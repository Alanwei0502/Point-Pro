import { FC } from 'react';
import styled from '@emotion/styled';

interface IGridProps {
  children: React.ReactNode;
  columns?: string;
  rows?: string;
  gap?: string;
  column?: string;
  row?: string;
  sx?: any;
  onClick?: React.MouseEventHandler<HTMLLIElement> | undefined;
}

const StyledGrid = styled('ul')<IGridProps>`
  margin: 0;
  padding: 0;
  display: grid;
  list-style: none;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, minmax(0, 1fr))` || 'repeat(3, 1fr)'};
  grid-template-rows: ${({ rows }) => `repeat(${rows}, minmax(0, 1fr))` || 'auto'};
  gap: ${({ gap }) => gap || '0'};
`;

const StyledGridItem = styled('li')<IGridProps>`
  grid-column: ${({ column }) => `span ${column} / span ${column}` || 'auto'};
  grid-row: ${({ row }) => `span ${row} / span ${row}` || 'auto'};
`;

export const BaseGrid: FC<IGridProps> = ({ children, columns, rows, gap, sx }) => {
  return (
    <StyledGrid columns={columns} rows={rows} gap={gap} sx={sx}>
      {children}
    </StyledGrid>
  );
};

export const BaseGridItem: FC<IGridProps> = ({ children, column, row, sx, onClick }) => {
  return (
    <StyledGridItem column={column} row={row} sx={sx} onClick={onClick}>
      {children}
    </StyledGridItem>
  );
};
