import { FC } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Title, Section } from '~/components';
import { useResponsiveStyles } from '~/hooks';
import { IMAGE_URL } from '~/constants';
import { theme } from '~/theme';

const aboutUsData = [
  {
    name: 'Alan',
    title: 'CEO',
    imgUrl: `${IMAGE_URL}cE8PwHym.png`,
    description: '領導團隊走向成功，擁有豐富的管理經驗。',
  },
  {
    name: 'Sam',
    title: 'CO-FOUNDER',
    imgUrl: `${IMAGE_URL}1z15oeAm.png`,
    description: '聯合創始人，技術專家與市場策略家。',
  },
  {
    name: 'Emily',
    title: 'DEVELOPER',
    imgUrl: `${IMAGE_URL}pDr5trFm.png`,
    description: '後端開發專家，保障系統穩定性。',
  },
  {
    name: 'LinYee',
    title: 'DEVELOPER',
    imgUrl: `${IMAGE_URL}ud201Upm.png`,
    description: '專注於前端開發，提升用戶體驗。',
  },
  {
    name: 'ShihHuan',
    title: 'DEVELOPER',
    imgUrl: `${IMAGE_URL}3fy2zohm.png`,
    description: '全端開發高手，解決複雜技術挑戰。',
  },
  {
    name: 'Cooper',
    title: 'DESIGNER',
    imgUrl: `${IMAGE_URL}dIn5b2Lm.png`,
    description: '創意設計師，負責產品視覺設計。',
  },
];

interface ITeamMembersProps {}

export const TeamMembers: FC<ITeamMembersProps> = () => {
  return (
    <Grid container spacing={2}>
      {aboutUsData.map((m, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              display: 'flex',
              height: '100%',
              justifyContent: 'space-between',
              borderRadius: '1rem',
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography variant='h5' fontWeight={600}>
                  {m.name}
                </Typography>
                <Typography variant='subtitle1' color='text.secondary'>
                  {m.title}
                </Typography>
                <Typography>{m.description}</Typography>
              </CardContent>
            </Box>
            <CardMedia component='img' sx={{ width: 140, height: 'auto' }} image={m.imgUrl} alt={m.name} loading='lazy' />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

interface IAboutUsProps {}

export const AboutUs: FC<IAboutUsProps> = () => {
  const { isTablet, isDesktop } = useResponsiveStyles();

  return (
    <Section id='about' isBgGray>
      <Box position='relative' textAlign='center' mb={isTablet ? 16 : 3}>
        <Box
          component='img'
          src={`${IMAGE_URL}xqbTOKeh.jpeg`}
          alt='about us'
          loading='lazy'
          sx={{
            width: '80%',
            height: 'auto',
            borderRadius: 5,
            objectFit: 'cover',
            boxShadow: '0 0 10px 5px rgba(0, 0, 0, 0.3)',
          }}
        />
        <Typography
          variant={isDesktop ? 'display1' : isTablet ? 'display3' : 'h1'}
          color='primary.main'
          fontWeight={900}
          textTransform='uppercase'
          position='absolute'
          top='80%'
          right={0}
        >
          About Us.
        </Typography>
      </Box>
      <Title title='我們傳奇的團隊' subtitle='我們是一群充滿熱情的專家，使用最新技術和工具為餐飲行業提供全方位的解決方案' />
      <TeamMembers />
    </Section>
  );
};
