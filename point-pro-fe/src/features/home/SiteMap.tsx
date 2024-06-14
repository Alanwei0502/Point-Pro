import { FC } from 'react';
import { Box, Container, Grid, List, ListItem, Typography, Link } from '@mui/material';
import { ReactComponent as LogoText } from '~/assets/Logo_text.svg';
import { useResponsiveStyles } from '~/hooks';
import { theme } from '~/theme';
import { NavLink } from '~/components';

const siteMapData = [
  {
    title: 'Menu',
    items: [
      {
        name: '產品功能',
        url: '#feature',
      },
      {
        name: '價格方案',
        url: '#pricing',
      },
      {
        name: '關於我們',
        url: '#about',
      },
      {
        name: '成功案例',
        url: '#success-case',
      },
    ],
  },
  {
    title: 'Social',
    items: [
      {
        name: 'Facebook',
        url: 'https://www.facebook.com/pointpro.tw',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/pointpro.tw',
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/pointpro_tw',
      },
      {
        name: 'Youtube',
        url: 'https://www.youtube.com/channel/UC_8XKZLt-Jxbh6t7wM1Z_5A',
      },
    ],
  },
];

interface ISiteMapProps {}

export const SiteMap: FC<ISiteMapProps> = () => {
  const { isTablet } = useResponsiveStyles();

  const handleClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  return (
    <Box bgcolor='primary.main' py={5}>
      <Container>
        <Box display='flex' alignItems='center' gap={5}>
          <Link href='/' onClick={(e) => handleClick(e, 'hero-section')}>
            <LogoText width={100} />
          </Link>
          <Typography variant={isTablet ? 'h2' : 'h5'} fontWeight={900} mb={5}>
            無論新創或連鎖餐廳，選擇 PointPro，助您業務飛躍！
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems='center'>
          {siteMapData.map((sm, index) => (
            <Grid item xs={isTablet ? 6 : 12} md={4} key={index}>
              <Typography fontSize={theme.typography.h6.fontSize} fontWeight={900} color='common.black_80'>
                {sm.title}
              </Typography>
              <List>
                {sm.items.map((i, index) => (
                  <ListItem key={index} disablePadding sx={{ marginBottom: 2 }}>
                    <NavLink href={i.url} color='common.black' onClick={(event) => handleClick(event, i.url.split('#')[1] || '')}>
                      <Typography fontSize={theme.typography.h4.fontSize} fontWeight={900}>
                        {i.name}
                      </Typography>
                    </NavLink>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
