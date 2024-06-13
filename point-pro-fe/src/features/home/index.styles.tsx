import { FC } from 'react';
import { Link, styled } from '@mui/material';
import { BaseButton } from '~/components';
import { decrement, increment } from './slice';
import { useAppSelector, useAppDispatch } from '~/hooks';

export const CounterButton: FC = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.value);

  return (
    <>
      <BaseButton aria-label='Increment value' onClick={() => dispatch(increment())}>
        Increment
      </BaseButton>
      <span>{count}</span>
      <BaseButton aria-label='Decrement value' onClick={() => dispatch(decrement())}>
        Decrement
      </BaseButton>
    </>
  );
};

export const NavLink = styled(Link)({
  position: 'relative',
  textDecoration: 'none',
  padding: '0 8px',
  '&::after': {
    transformOrigin: 'left',
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 3,
    backgroundColor: 'currentColor',
    transform: 'scaleX(0) translateY(0.25rem)',
    transition: 'transform 0.3s ease-in-out',
  },
  '&:hover::after': {
    transform: 'scaleX(1) translateY(0.25rem)',
  },
});
