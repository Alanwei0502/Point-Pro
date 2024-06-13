import { FC } from 'react';
import { HeaderNavBar } from './HeaderNavBar';
import { Banner } from './Banner';
import { Feature } from './Feature';
import { Pricing } from './Pricing';
import { Testimonial } from './Testimonial';
import { SuccessCase } from './SuccessCase';
import { Subscription } from './Subscription';
import { AboutUs } from './AboutUs';
import { Map } from './Map';
import { SiteMap } from './SiteMap';
import { ContactFormModal } from './ContactFormModal';
import { BackToTopButton, Footer } from '~/components';
import 'swiper/css';
import 'swiper/css/pagination';

interface IHomeProps {}

export const Home: FC<IHomeProps> = () => {
  return (
    <>
      <HeaderNavBar />
      <Banner />
      <Feature />
      <Pricing />
      <Testimonial />
      <SuccessCase />
      <Subscription />
      <AboutUs />
      <Map />
      <SiteMap />
      <Footer />
      <BackToTopButton />
      {/* Modal */}
      <ContactFormModal />
    </>
  );
};
