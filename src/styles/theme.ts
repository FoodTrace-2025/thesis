// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#3182CE',    // Green - main actions
      secondary: '#38A169',  // Green - success/positive
      accent: '#DD6B20',     // Orange - warnings/highlights
      dark: '#1A202C',       // Dark gray - text
      light: '#F7FAFC',      // Light gray - backgrounds
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'green',
      },
    },
     Container: {
      baseStyle: {
        maxW: '1280px',
        px: { base: 4, md: 8 },
      },
    },
  },
});

export default theme;
