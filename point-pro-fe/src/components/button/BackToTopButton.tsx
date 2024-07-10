import { FC, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { theme } from '~/theme';

interface IBackToTopButtonProps {}

export const BackToTopButton: FC<IBackToTopButtonProps> = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(currentScrollPosition > windowHeight * 0.1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        width: 50,
        height: 50,
        position: 'fixed',
        bottom: 20,
        right: 20,
        transform: `scale(${isVisible ? 1 : 0})`,
        opacity: isVisible ? 1 : 0,
        transition: '.3s',
        zIndex: 999,
        borderRadius: '50%',
        backgroundColor: theme.palette.secondary.light,
        color: 'white',
      }}
      aria-label='back to top'
    >
      <ArrowUpwardIcon fontSize='small' />
    </IconButton>
  );
};
