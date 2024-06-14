import { Link, styled } from '@mui/material';

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
