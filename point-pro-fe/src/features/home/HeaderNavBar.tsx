import { FC, useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Row, NavLink } from '~/components';
import { useResponsiveStyles } from '~/hooks';
import { ReactComponent as Logo } from '~/assets/images/logo.svg';

const navData = [
  {
    name: '產品功能',
    url: '#feature',
  },
  {
    name: '價格方案',
    url: '#pricing',
  },
  {
    name: '成功案例',
    url: '#success-case',
  },
  {
    name: '關於我們',
    url: '#about',
  },
];

interface IDesktopMenuProps {}

const DeskTopMenu: FC<IDesktopMenuProps> = () => {
  return (
    <List
      key='Menu'
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '1.25rem',
      }}
    >
      {navData.map((item) => (
        <ListItem
          key={item.name}
          disablePadding
          sx={{
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
          }}
        >
          <ListItemText
            primary={
              <NavLink href={item.url} underline='none' color='white'>
                <Typography variant='h6' component='span'>
                  {item.name}
                </Typography>
              </NavLink>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

interface IMobileMenuProps {}

const MobileMenu: FC<IMobileMenuProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Box display='flex' justifyContent='flex-end' pt={1} pb={1}>
      <Button
        role='button'
        aria-label='menu'
        sx={{
          backgroundColor: 'primary.main',
          color: 'common.black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem 0.75rem 0.75rem 1.5rem',
          borderRadius: '1.25rem 0 0 1.25rem',
          transform: 'translateX(1.25rem)',
        }}
        onClick={() => toggleMenu(true)}
      >
        <MenuIcon />
        <Typography>MENU</Typography>
      </Button>
      <Drawer anchor='left' open={isOpen} onClose={() => toggleMenu(false)} PaperProps={{ style: { minWidth: '100vw', minHeight: '100vh' } }}>
        <Box width='100vw' height='100vh' display='flex' flexDirection='column' bgcolor='primary.main' color='common.black'>
          <Box display='flex' justifyContent='flex-end' pt={1} pb={1}>
            <Button
              onClick={() => toggleMenu(false)}
              role='button'
              aria-label='close'
              sx={{
                backgroundColor: 'common.black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 0.75rem 0.75rem 1.5rem',
                borderRadius: '1.25rem 0 0 1.25rem',
              }}
            >
              <CloseIcon />
              <Typography variant='body1' component={'span'}>
                CLOSE
              </Typography>
            </Button>
          </Box>
          <List
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            {navData.map((item) => (
              <ListItem
                key={item.name}
                disablePadding
                sx={{
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                }}
              >
                <ListItemText
                  primary={
                    <NavLink href={item.url} underline='none' color='common.black' onClick={() => toggleMenu(false)}>
                      <Typography variant='h1' component='span' fontWeight={700} color='common.black'>
                        {item.name}
                      </Typography>
                    </NavLink>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

interface IHeaderNavBarProps {}

export const HeaderNavBar: FC<IHeaderNavBarProps> = () => {
  const { isTablet } = useResponsiveStyles();

  const [isHidden, setIsHidden] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsHidden(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      setScrollTimeout(window.setTimeout(() => setIsHidden(false), 500));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollTimeout]);

  return (
    <Box position='fixed' top={0} width='100%' zIndex={999}>
      <Box
        width='100%'
        zIndex={1000}
        height={isHidden ? '0%' : '100%'}
        sx={{
          transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
          transition: '0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(to bottom, rgba(3, 3, 3, 0.7), rgba(0, 0, 0, 0))',
            backdropFilter: 'blur(.3rem)',
          },
        }}
      >
        <Container maxWidth='lg'>
          <Row justifyContent='space-between' alignItems='center'>
            <Link href='/' key='Home' aria-label='go to home page'>
              <Logo style={{ height: isTablet ? 64 : 40, aspectRatio: 1 }} />
            </Link>

            {isTablet ? <DeskTopMenu /> : <MobileMenu />}
          </Row>
        </Container>
      </Box>
    </Box>
  );
};
