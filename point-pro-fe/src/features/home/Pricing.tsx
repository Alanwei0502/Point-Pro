import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import { Grid, Typography, List, ListItem, ListItemText, Box, styled } from '@mui/material';
import { GlobalStyles, css } from '@mui/system';
import CheckIcon from '@mui/icons-material/Check';
import { Row, Column, CallToActionButton, Title, Section } from '~/components';
import { useAppDispatch, useResponsiveStyles } from '~/hooks';
import { getImageUrl } from '~/utils';
import { homeSliceActions } from '~/store/slices';
import { theme } from '~/theme';

type AnimatedCardProps = {
  index: number;
};

export const AnimatedCard = styled(Column)<AnimatedCardProps>(({ theme, index }) => ({
  userSelect: 'none',
  position: 'relative',
  cursor: 'pointer',
  transition: theme.transitions.create(['transform', 'opacity', 'z-index'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  transform: `translateX(${index === 0 ? '3rem' : index === 2 ? '-3rem' : 0}) scale(${index === 0 || index === 2 ? 0.8 : 1})`,
  filter: `blur(${index === 1 ? 0 : 0.5}px)`,
  zIndex: index === 1 ? 2 : 1,
  '&::after':
    index === 1
      ? {}
      : {
          content: "''",
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.5)',
        },
}));

const pricingData = [
  {
    id: 1,
    title: '基本版',
    price: '299/月',
    content: ['單一設備連線', '基本銷售報告', '產品庫存管理', '信用卡/現金支付', '電子收據功能', '電子郵件支援'],
    imgUrl: getImageUrl('pricing-plan01.jpg'),
    animationClass: '',
  },
  {
    id: 2,
    title: '專業版',
    price: '999/月',
    content: ['多設備連線', '高級銷售報告', '高級庫存管理', '員工管理與時薪追踪', '促銷活動設定', '24/7專業客服支援'],
    imgUrl: getImageUrl('pricing-plan02.jpg'),
    animationClass: '',
  },
  {
    id: 3,
    title: '企業版',
    price: '聯繫獲取定價',
    content: ['定制功能與整合', '企業報告', '專屬客戶經理', 'API整合', '線上與電話客服支援', '量身打造的解決方案'],
    imgUrl: getImageUrl('pricing-plan03.jpg'),
    animationClass: '',
  },
];

const globalStyles = css`
  .moveLeft {
    animation: moveLeft 500ms forwards;
  }

  .moveRight {
    animation: moveRight 500ms forwards;
  }

  @keyframes moveLeft {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes moveRight {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const { openCallToActionModal } = homeSliceActions;

interface IPricingProps {}
export const Pricing: FC<IPricingProps> = () => {
  const dispatch = useAppDispatch();

  const [cards, setCards] = useState(pricingData);
  const [animationClass, setAnimationClass] = useState<{ [key: number]: string }>({
    0: '',
    1: '',
    2: '',
  });

  const { isDesktop } = useResponsiveStyles();

  const handleOpenCallToActionModal = () => {
    dispatch(openCallToActionModal());
  };

  const handleCardClick = (clickedCardIndex: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const clickedCard = newCards[clickedCardIndex];
      const centerCard = newCards[1];
      if (clickedCardIndex < 1) {
        // Move clicked card to the left of the center card
        newCards.splice(1, 1, clickedCard);
        newCards.splice(clickedCardIndex, 1, centerCard);
        // Remove animation classes from all cards
        newCards.forEach((card) => {
          card.animationClass = '';
        });
        // Set animation class
        setAnimationClass({ [clickedCardIndex]: 'moveRight', [1]: 'moveLeft' });
      } else if (clickedCardIndex > 1) {
        // Move clicked card to the right of the center card
        newCards.splice(clickedCardIndex, 1);
        newCards.splice(1, 0, clickedCard);
        // Remove animation classes from all cards
        newCards.forEach((card) => {
          card.animationClass = '';
        });
        // Set animation class
        setAnimationClass({ [1]: 'moveRight', [clickedCardIndex]: 'moveLeft' });
      }

      return newCards;
    });
    // Reset animation class
    setTimeout(() => {
      setAnimationClass({});
    }, 300);
  };

  return (
    <Section id='pricing'>
      <Title
        title='我們的價格方案'
        subtitle='透明且無隱藏費用的定價，讓您放心選擇 PointPro 做為您的餐飲 POS 合作夥伴'
        bigTitle='無論您是新創餐廳還是連鎖品牌，PointPro 都能為您提供最適合的解決方案'
      />
      {isDesktop ? (
        <>
          <Grid container spacing={2}>
            <GlobalStyles styles={globalStyles} />
            {cards.map((card, index) => (
              <Grid item xs={4} md={4} key={`card-${card.id}`}>
                <AnimatedCard className={animationClass[index]} onClick={() => handleCardClick(index)} data-id={card.id} index={index}>
                  <img style={{ height: 262, borderRadius: '2.5rem', objectFit: 'cover', width: '100%' }} src={card.imgUrl} title={card.title} />
                  <Box p={2} borderRadius={5} bgcolor='background.paper'>
                    <Row sx={{ justifyContent: 'space-between' }} my={1}>
                      <Typography fontSize={theme.typography.h6.fontSize} fontWeight={900}>
                        {card.title}
                      </Typography>
                      <Typography fontSize={theme.typography.h6.fontSize} fontWeight={900}>
                        {card.price}
                      </Typography>
                    </Row>
                    <List sx={{ marginBottom: 1 }}>
                      {card.content.map((content, index) => (
                        <ListItem key={`content-${index}`} sx={{ paddingTop: 0, gap: 1 }}>
                          <CheckIcon color='primary' fontSize='small' />
                          <ListItemText primary={content} />
                        </ListItem>
                      ))}
                    </List>
                    <CallToActionButton handleOnClick={handleOpenCallToActionModal} sx={{ mx: 'auto' }}>
                      立即詢問
                    </CallToActionButton>
                  </Box>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
          <Typography fontSize={16} fontWeight={600} align='center'>
            立即註冊，開始免費試用， 讓您的餐飲業務達到新的高峰
          </Typography>
        </>
      ) : (
        <Grid>
          <Swiper spaceBetween={30} grabCursor={true} loop={true} pagination modules={[Pagination]}>
            {pricingData.map((p) => (
              <SwiperSlide key={p.id}>
                <Box p={1} borderRadius={5} bgcolor='background.paper'>
                  <img style={{ height: 200, borderRadius: '2.5rem', objectFit: 'cover', width: '100%' }} src={p.imgUrl} title={p.title} />
                  <Row sx={{ justifyContent: 'space-between' }} my={1}>
                    <Typography fontSize={theme.typography.h6.fontSize} fontWeight={900}>
                      {p.title}
                    </Typography>
                    <Typography fontSize={theme.typography.h6.fontSize} fontWeight={900}>
                      {p.price}
                    </Typography>
                  </Row>
                  <List sx={{ marginBottom: 1 }}>
                    {p.content.map((content, index) => (
                      <ListItem key={`content-${index}`} sx={{ paddingTop: 0, gap: 1 }}>
                        <CheckIcon color='primary' fontSize='small' />
                        <ListItemText primary={content} />
                      </ListItem>
                    ))}
                  </List>
                  <CallToActionButton handleOnClick={handleOpenCallToActionModal} sx={{ mx: 'auto', mb: 3 }}>
                    立即詢問
                  </CallToActionButton>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Grid>
      )}
    </Section>
  );
};
