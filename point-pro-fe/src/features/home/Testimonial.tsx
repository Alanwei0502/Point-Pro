import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import { Section, Title } from '~/components';
import { useResponsiveStyles } from '~/hooks';
import { IMAGE_URL } from '~/utils';
import { theme } from '~/theme';

const testimonialsData = [
  {
    name: '林怡君',
    rate: 5,
    imgUrl: `${IMAGE_URL}DaJNJXql.jpeg`,
    content: '我們的餐廳使用了PointPro，非常滿意！系統操作簡單易懂，訂單處理更加快速，客戶滿意度也大幅提升了。',
  },
  {
    name: '李大偉',
    rate: 4.5,
    imgUrl: `${IMAGE_URL}Hrwdunql.jpeg`,
    content: '在PointPro的支援下，我們店裡的客戶服務更加高效率。系統可以追蹤訂單，幫助我們掌握客人喜好，並且快速處理退款等問題。',
  },
  {
    name: '張家豪',
    rate: 4,
    imgUrl: `${IMAGE_URL}hHWUmdXl.jpeg`,
    content: '我在使用PointPro的餐廳點餐時，感到非常方便和快速。系統操作簡單易懂，訂單也能快速處理，餐點的味道也非常美味。',
  },
  {
    name: '黃雅婷',
    rate: 5,
    imgUrl: `${IMAGE_URL}axRAW9al.jpeg`,
    content: '我們店裡使用了PointPro的內用點餐系統，大大減輕了我們員工的工作量，客人點餐更加方便快速。',
  },
  {
    name: '許志偉',
    rate: 4.5,
    imgUrl: `${IMAGE_URL}6sCQPiIl.jpeg`,
    content: 'PointPro的外帶點餐系統非常好用，能夠快速處理訂單，大大提高了效率，也省去了客人等待的時間。',
  },
  {
    name: '郭承恩',
    rate: 5,
    imgUrl: `${IMAGE_URL}AqccSr1l.jpeg`,
    content: '我們公司導入了PointPro，整合了POS系統、訂單管理等多個功能，讓我們的營運管理更加順暢。',
  },
];

interface ITestimonialProps {}

export const Testimonial: FC<ITestimonialProps> = () => {
  const { isTablet } = useResponsiveStyles();

  return (
    <Section id='testimonial' isBgGray>
      <Title title='客戶分享' subtitle='親身經歷，值得信賴，從使用中獲得的真實體驗' bigTitle='我們的解決方案如何改變他們的生活' />
      <Grid sx={{ userSelect: 'none' }}>
        <Swiper
          spaceBetween={isTablet ? 30 : 16}
          slidesPerView={isTablet ? 3 : 1.2}
          centeredSlides={true}
          grabCursor={true}
          loop={true}
          modules={[Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          {testimonialsData.map((t) => (
            <SwiperSlide key={t.name}>
              <img
                src={t.imgUrl}
                alt={t.name}
                loading='lazy'
                style={{
                  borderRadius: '2.5rem',
                  width: '100%',
                  maxHeight: '19.5rem',
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                }}
              />
              <Box bgcolor='white' borderRadius='2.5rem' flex='column' p={3}>
                <Rating value={t.rate} precision={0.5} size='small' readOnly />
                <Typography fontSize={theme.typography.h5.fontSize} fontWeight={900} my={1}>
                  {t.name}
                </Typography>
                <Typography color='common.black_80'>{t.content}</Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Grid>
    </Section>
  );
};
