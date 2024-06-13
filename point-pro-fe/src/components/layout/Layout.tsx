import { styled, Box } from '@mui/material';

interface IRowProps {
  length?: number;
  align?: string;
}

export const Row = styled(Box)((props: IRowProps) => ({
  display: 'flex',
  position: 'relative',
  alignItems: props.align || 'center',
}));

export const Column = styled(Box)(() => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
}));
