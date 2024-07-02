import { CSSProperties, FC } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { theme } from '~/theme';

interface ICloseButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  sx?: CSSProperties;
}

export const StyledCloseButton = styled(Button)(() => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.common.black,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.common.black_80,
    color: theme.palette.common.black_20,
  },
}));

export const CloseButton: FC<ICloseButtonProps> = ({ onClick, sx }) => (
  <StyledCloseButton color='inherit' onClick={onClick} sx={{ ...sx }}>
    <CloseIcon />
  </StyledCloseButton>
);
