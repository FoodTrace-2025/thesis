// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: '#2F7D32',    // Green - main actions
      secondary: '#6DBE45',  // Green - success/positive
      accent: '#FFA94D',     // Orange - warnings/highlights
      dark: '#6B7280',       // Dark gray - text
      light: '#F9FBFD',      // Light gray - backgrounds
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