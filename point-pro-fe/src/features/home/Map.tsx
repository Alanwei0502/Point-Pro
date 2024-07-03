import { FC } from 'react';

interface IMapProps {}

export const Map: FC<IMapProps> = () => {
  return (
    <iframe
      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1807.5026622384723!2d121.56375569496763!3d25.033893372005938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abe131ed2597%3A0x9750447314724ac4!2z5Y-w5YyXMTAx6L6m5YWs5aSn5qiT!5e0!3m2!1szh-TW!2stw!4v1718275615948!5m2!1szh-TW!2stw'
      width='100%'
      height='500'
      title='google map'
      style={{ border: 'none' }}
      loading='lazy'
      referrerPolicy='no-referrer-when-downgrade'
    ></iframe>
  );
};
