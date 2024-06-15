import { FC } from 'react';
import { Button, ButtonProps, styled } from '@mui/material';

const BaseButton = styled(Button)<ButtonProps>(({ theme, size }) => ({
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
