import { FC, useEffect, useRef, useState } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { IMAGE_URL } from '~/utils';
import { useResponsiveStyles } from '~/hooks';
import { CallToActionButton } from '~/components';

const getCurvePath = (width: number, height: number, borderRadius: number): string => {
  const startX = 0;
  const startY = height - borderRadius;
  const endX = width;
  const endY = startY;
  const controlX = width / 2;
  const controlY = startY + borderRadius; // 調整控制點的 Y 值

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
};

interface IBannerProps {
  setIsOpenCallToActionModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Banner: FC<IBannerProps> = (props) => {
  const { setIsOpenCallToActionModal } = props;
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const [curvePath, setCurvePath] = useState('');
  const theme = useTheme();
  const { isTablet } = useResponsiveStyles();

  const handleOpenCallToActionModal = () => {
    setIsOpenCallToActionModal(true);
  };

  useEffect(() => {
    const handleSetCurvePath = () => {
      if (bannerRef.current) {
        const { clientWidth, clientHeight } = bannerRef.current;
        const borderRadius = clientHeight / 1.75;
        setCurvePath(getCurvePath(clientWidth, clientHeight, borderRadius));
      }
    };
    handleSetCurvePath();
    window.addEventListener('resize', handleSetCurvePath);
    return () => {
      window.removeEventListener('resize', handleSetCurvePath);
    };
  }, []);

  return (
    <Box component='section' id='hero-section' bgcolor='background.paper'>
      <Box
        ref={bannerRef}
        maxWidth='xl'
        mx='auto'
        sx={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: isTablet ? '0 0 50% 50% / 50%' : '0',
          minHeight: '100vh',
        }}
      >
        <video
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: '50% 50%',
          }}
          src={`${IMAGE_URL}KOH3og1.mp4`}
          autoPlay={true}
          muted={true}
          loop={true}
        />
        <Container sx={{ zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Typography
            variant={isTablet ? 'display3' : 'h2'}
            lineHeight={1.2}
            color='white'
            component='h1'
            // mb={5}
            sx={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            客製化服務， <br />
            提供獨特的餐飲體驗
            <Typography fontSize={isTablet ? theme.typography.h2.fontSize : theme.typography.h4.fontSize} mt={5} mb={10}>
              特別的餐飲體驗, 來自於我們與您的專屬互動
            </Typography>
          </Typography>
          <CallToActionButton handleOnClick={handleOpenCallToActionModal}>立即詢問</CallToActionButton>
          {isTablet ? (
            <Box
              component='svg'
              viewBox={`0 0 ${bannerRef.current?.clientWidth || 0} ${bannerRef.current?.clientHeight || 0}`} // 修改 viewBox 的值
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 100,
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                zIndex: -1,
              }}
            >
              <path id='curve' d={curvePath} fill='none' />
              <text fill='white' dy='7rem' fontSize='1.25rem'>
                <textPath href='#curve' textAnchor='middle' startOffset='50%'>
                  立即開啟PointPro餐飲POS系統，提升顧客滿意度
                </textPath>
              </text>
            </Box>
          ) : (
            <Typography
              color='white'
              fontSize='1.25rem'
              textAlign='center'
              sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', zIndex: -1, px: 4, pb: 2 }}
            >
              立即開啟PointPro餐飲POS系統，提升顧客滿意度
            </Typography>
          )}
        </Container>
      </Box>
    </Box>
  );
};
