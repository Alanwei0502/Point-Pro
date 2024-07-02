import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Column } from '../layout/Layout';

interface ISectionProps extends BoxProps {
  id: string;
  isBgGray?: boolean;
}

export const Section: FC<ISectionProps> = ({ id, isBgGray, children }) => {
  return (
    <Box
      component='section'
      id={id}
      sx={{
        '&::before': {
          content: "''",
          display: 'block',
          height: '100px',
          marginTop: '-100px',
          visibility: 'hidden',
        },
      }}
    >
      <Box py={5} bgcolor={isBgGray ? 'background.paper' : 'white'}>
        <Container>
          <Column sx={{ gap: 4 }}>{children}</Column>
        </Container>
      </Box>
    </Box>
  );
};
