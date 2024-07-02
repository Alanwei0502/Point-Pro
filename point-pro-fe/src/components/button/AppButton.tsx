import { FC } from 'react';
import styled from '@emotion/styled';
import Button, { ButtonProps } from '@mui/material/Button';
import { theme } from '~/theme';

const BaseButton = styled(Button)<ButtonProps>(({ size }) => ({
  fontSize: size || 14,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  '&.Mui-disabled': {
    color: theme.palette.common.black_80,
    backgroundColor: theme.palette.common.black_40,
  },
}));

interface IAppButtonProps extends ButtonProps {
  loading?: boolean;
}

export const AppButton: FC<IAppButtonProps> = (props) => {
  const { children, loading = false, disabled, ...restProps } = props;

  const isDisabled = loading || disabled;
  return (
    <BaseButton variant='contained' color='primary' disabled={isDisabled} {...restProps}>
      {children}
    </BaseButton>
  );
};
