import { FC } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Assignment, MoreTime, MenuBook, Inventory } from '@mui/icons-material';
import { Column, Section, Title } from '~/components';
import { useResponsiveStyles } from '~/hooks';
import { getImageUrl } from '~/utils';
import { theme } from '~/theme';
import { ReactComponent as FeatureIllustration } from '~/assets/featureIllustration.svg';

const systems = [
  {
    icon: <Assignment sx={{ fontSize: 42 }} />,
    title: '訂單管理',
    description: '簡便且高效的訂單管理系統，幫助餐廳營運更流暢。',
  },
  {
    icon: <MoreTime sx={{ fontSize: 42 }} />,
    title: '預訂管理',
    description: '直覺的預訂管理系統，使餐廳更優化預訂管理。',
  },
  {
    icon: <MenuBook sx={{ fontSize: 42 }} />,
    title: '菜單管理',
    description: '簡單的菜單編輯工具，讓餐廳可以輕鬆管理和編輯。',
  },
  {
    icon: <Inventory sx={{ fontSize: 42 }} />,
    title: '庫存管理',
    description: '庫存管理工具，更好地管理庫存，減少浪費。',
  },
];

interface SystemFeatureCardProps {}

export const SystemFeatureCards: FC<SystemFeatureCardProps> = () => {
  return (
    <Grid item xs={12} md={5} display='flex' flexDirection='column' gap={2}>
      {systems.map((s) => (
        <Grid container key={s.title} gap={1}>
          <Grid item flex={3}>
            <Column p={2.5} bgcolor='white' borderRadius={3} justifyContent='center'>
              <Typography lineHeight={1} fontWeight={900} fontSize={theme.typography.h6.fontSize} mb={1}>
                {s.title}
              </Typography>
              <Typography color='common.black_80'>{s.description}</Typography>
            </Column>
          </Grid>
          <Grid item flex={1}>
            <Box padding={1} borderRadius={2.5} bgcolor='white' color='primary.main' height='100%'>
              <Box
                borderRadius='2rem'
                padding={2}
                width='100%'
                height='100%'
                bgcolor='rgba(247, 194, 36, 0.16)'
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                {s.icon}
              </Box>
            </Box>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

const features = [
  {
    imgUrl: getImageUrl('feature01.jpg'),
    title: '客製化菜單',
    description: '提供客人個性化的餐飲選擇，讓他們品嚐到獨特的體驗。',
  },
  {
    imgUrl: getImageUrl('feature02.jpg'),
    title: '溫馨提醒',
    description: '智能POS助顧客餐點補充，感受關懷與新鮮度。',
  },
  {
    imgUrl: getImageUrl('feature03.jpg'),
    title: '科技提升體驗',
    description: '智能點餐、雲端支付，顧客享受便利與舒適。',
  },
  {
    imgUrl: getImageUrl('feature04.jpg'),
    title: '客人回饋',
    description: '定期收集意見，解決問題，顧客感受尊重。',
  },
];

interface IFeatureCardsProps {
  isTablet: boolean;
  isDesktop: boolean;
}

export const FeatureCards: FC<IFeatureCardsProps> = ({ isTablet, isDesktop }) => {
  return (
    <Grid container mx='auto'>
      {features.map((f) => (
        <Grid item xs={isDesktop ? 12 : 6} md={3} padding={1} key={f.title} display='flex' flexDirection='column' alignItems='center'>
          <img
            src={f.imgUrl}
            style={{
              borderRadius: '2.5rem',
              width: '100%',
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />
          <Box flex='column' p={1} textAlign='center'>
            <Typography fontSize={isTablet ? 24 : 22} fontWeight={900} mb={3}>
              {f.title}
            </Typography>
            <Typography color='common.black_80' fontSize={isTablet ? 20 : 18}>
              {f.description}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

interface IFeatureProps {}

export const Feature: FC<IFeatureProps> = () => {
  const { isTablet, isDesktop } = useResponsiveStyles();
  return (
    <Section id='feature' isBgGray>
      <Title
        title='產品功能特色'
        subtitle='為您的餐廳帶來卓越的管理體驗，PointPro POS 系統專為提升營運效率而設計'
        bigTitle='個性化、貼心、無微不至的餐飲服務'
      />
      <FeatureCards isTablet={isTablet} isDesktop={isDesktop} />
      <Grid container alignItems='center' justifyContent='space-around'>
        <Grid item xs={12} md={5} display='flex' flexDirection='column' justifyContent='space-between' alignItems='center'>
          <Typography fontSize={isTablet ? 42 : 30} fontWeight={900}>
            智能化經營、靈活管理、實現更大收益
          </Typography>
          <Box m={2}>
            <FeatureIllustration />
          </Box>
        </Grid>
        <SystemFeatureCards />
      </Grid>
    </Section>
  );
};
