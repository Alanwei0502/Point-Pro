import { FC, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button, { type ButtonProps } from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ICallToActionProps extends ButtonProps {
  children: React.ReactNode;
  handleOnClick: () => void;
}

export const CallToActionButton: FC<ICallToActionProps> = ({ children, handleOnClick, sx, ...props }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Button
      variant='contained'
      size='large'
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '5rem',
        padding: '0.5rem 0.5rem 0.5rem 2rem',
        cursor: 'pointer',
        ...sx,
      }}
      onClick={handleOnClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      <Typography variant='h6' lineHeight={1.2} fontWeight={900} component='span' mr={5}>
        {children}
      </Typography>
      <Box
        borderRadius='50%'
        height='2rem'
        width='2rem'
        sx={{
          display: 'grid',
          placeContent: 'center',
          backgroundColor: '#00000014',
          color: 'common.black',
          transition: 'all 0.3s ease',
          transformOrigin: 'right center',
        }}
      >
        <Icon sx={{ display: 'grid', placeContent: 'center', fontSize: '1.5rem', color: 'white' }}>
          {isHover ? <ArrowForwardIcon /> : <FingerprintIcon />}
        </Icon>
      </Box>
    </Button>
  );
};
