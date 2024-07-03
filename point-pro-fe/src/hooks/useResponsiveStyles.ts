import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useResponsiveStyles = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.up('xs')); // 0
  const isTablet = useMediaQuery(theme.breakpoints.up('sm')); // 600
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // 960
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // 1280
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // 1920

  return { isMobile, isTablet, isDesktop, isLg, isXl };
};
