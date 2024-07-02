import styled from '@emotion/styled';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { theme } from '~/theme';

export const TextareaInput = styled(TextareaAutosize)(() => ({
  // your custom styles go here
  position: 'relative',
  borderRadius: '4px',
  borderColor: 'rgba(0, 0, 0, 0.23)',
  boxSizing: 'border-box',
  minHeight: '100px',
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body1.fontSize,
  '&:focus-visible': {
    outlineColor: theme.palette.primary.main,
  },
}));
