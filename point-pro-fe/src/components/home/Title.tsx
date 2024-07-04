import { FC } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { type SxProps, type Theme } from '@mui/system';
import Circle from '@mui/icons-material/Circle';
import { theme } from '~/theme';
import { useResponsiveStyles } from '~/hooks';

interface Title {
  title: string;
  subtitle: string;
  bigTitle?: string;
  sx?: SxProps<Theme>;
}

export const Title: FC<Title> = ({ title, subtitle, bigTitle = '', sx }) => {
  const { isTablet } = useResponsiveStyles();

  return (
    <Box display='flex' flexDirection={isTablet ? 'row' : 'column'} gap={isTablet ? 6 : 2.5}>
      <Box sx={{ ...sx }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
          mb={1}
        >
          <Circle sx={{ fontSize: '1rem', color: 'primary.main' }} />
          <Typography fontSize={theme.typography.h5.fontSize} fontWeight={900}>
            {title}
          </Typography>
        </Box>
        <Box ml={3}>
          <Typography fontSize={theme.typography.h6.fontSize} color='common.black_80'>
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Typography fontSize={isTablet ? 42 : 28} fontWeight={900}>
        {bigTitle}
      </Typography>
    </Box>
  );
};
