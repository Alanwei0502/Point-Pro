import { FC, useState } from 'react';
import { Box } from '@mui/material';
import { AboutUsSection } from './AboutUsSection';
import { BackToTopButton } from './BackToTop';
import { ContactFormModal } from './ContactFormModal';
import { FeatureSection } from './FeatureSection';
import { HeroSection } from './HeroSection';
import { MapSection } from './MapSection';
import { PricingSection } from './PricingSection';
import { SiteMapSection } from './SiteMapSection';
import { SubscribedSection } from './SubscribedSection';
import { TestimonialsSection } from './TestimonialsSection';
import { HeaderNavBar } from './HeaderNavBar';
import { SuccessCase } from './SuccessCase';
import { Footer } from '~/components';

interface HomeProps {}

export const Home: FC<HomeProps> = ({ ...rest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <>
      <BackToTopButton position={{ bottom: 50, right: 50 }} />
      <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 999 }}>
        <HeaderNavBar />
      </Box>
      <HeroSection openModal={handleOpenModal} />
      <FeatureSection />
      <PricingSection openModal={handleOpenModal} />
      <TestimonialsSection />
      <SuccessCase />
      <SubscribedSection />
      <AboutUsSection />
      <MapSection />
      <SiteMapSection />
      <Footer />
      <ContactFormModal open={isOpen} onClose={handleCloseModal} />
    </>
  );
};
