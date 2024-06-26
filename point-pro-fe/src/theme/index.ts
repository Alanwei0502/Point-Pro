import { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CommonColors {
    black_80: string;
    black_60: string;
    black_40: string;
    black_20: string;
  }

  interface TypographyVariants {
    display1: CSSProperties;
    display2: CSSProperties;
    display3: CSSProperties;
    small: CSSProperties;
    tiny: CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    display1?: CSSProperties;
    display2?: CSSProperties;
    display3?: CSSProperties;
    small?: CSSProperties;
    tiny?: CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    display1: true;
    display2: true;
    display3: true;
    tiny: true;
    small: true;
  }
}

// Create a theme instance.
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    common: {
      black: '#020202',
      black_80: '#525252',
      black_60: '#919191',
      black_40: '#D1D1D1',
      black_20: '#F2F2F2',
      white: '#FFFFFF',
    },
    primary: {
      light: '#fadf8d',
      main: '#F7C324',
      dark: '#c59c1c',
      contrastText: '#020202',
    },
    secondary: {
      main: '#020202',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#020202',
      disabled: '#D1D1D1',
    },
    divider: '#D1D1D1',
    background: {
      paper: '#F8F8F8',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    display1: { fontSize: '10rem' },
    display2: { fontSize: '7.5rem' },
    display3: { fontSize: '5rem' },
    h1: { fontSize: '3rem' },
    h2: { fontSize: '2.5rem', fontWeight: 900, lineHeight: '48px' }, // 40px
    h3: { fontSize: '2rem', fontWeight: 900, lineHeight: '38.4px' }, // 32px
    h4: { fontSize: '1.75rem' },
    h5: { fontSize: '1.5rem' }, // 24px
    h6: { fontSize: '1.25rem' }, // 20px
    body1: { fontSize: '1rem' }, // 16px
    small: { fontSize: '0.875rem' }, // 14px
    tiny: { fontSize: '0.75rem' }, // 12px
    button: {
      fontSize: '20px',
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          small: 'p',
          body1: 'p',
        },
      },
    },
  },
});
