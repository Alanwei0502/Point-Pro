import { FC } from 'react';
import { Box, BoxProps, CircularProgress, CircularProgressProps } from '@mui/material';

interface ILoadingProps {
  boxProps?: BoxProps;
  circularProgressProps?: CircularProgressProps;
}

export const Loading: FC<ILoadingProps> = (props) => {
  const { boxProps, circularProgressProps } = props;
  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='100%' {...boxProps}>
      <CircularProgress {...circularProgressProps} />
    </Box>
  );
};
