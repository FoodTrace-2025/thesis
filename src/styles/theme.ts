// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#2F7D32",      // Primary buttons, main actions (green)
      secondary: "#6DBE45",    // Hover states, icons (light green)
      accent: "#EA580C",       // Highlights, links (e.g., Forgot password)
      dark: "#1F2937",         // Primary text
      muted: "#6B7280",        // Secondary text
      border: "#D1D5DB",       // Input/card borders
      surface: "#FFFFFF",      // White card backgrounds
      surfaceAlt: "#E9F6E2",   // Light green background, selected states
      pageBg: "#FFF6DA",       // Page background (cream/yellow)
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
        variant: "solid",   // Default to solid green button when no variant specified
      },
      baseStyle: {
        borderRadius: "md",
        fontWeight: "semibold",
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "white",
          _hover: {
            bg: "brand.secondary",
          },
          _disabled: {
            bg: "brand.primary",
            opacity: 0.6,
            cursor: "not-allowed",
          },
        },
        outline: {
          bg: "brand.surface",
          color: "brand.dark",
          borderWidth: "1px",
          borderColor: "brand.border",
          _hover: {
            bg: "brand.surfaceAlt",
          },
          _disabled: {
            bg: "brand.surface",
            opacity: 0.6,
            cursor: "not-allowed",
          },
        },
      },
    },

    Input: {
      defaultProps: {
        bg: "brand.surface",
        borderColor: "brand.border",
        focusBorderColor: "brand.secondary",
      },
      baseStyle: {
        field: {
          _focus: {
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-secondary)",
          },
        },
      },
    },

    Checkbox: {
      baseStyle: {
        control: {
          borderColor: "brand.border",
          _checked: {
            bg: "brand.primary",
            borderColor: "brand.primary",
          },
        },
        label: {
          color: "brand.dark", // Label text color
        },
      },
    },

    Card: {
      baseStyle: {
        container: {
          borderRadius: "md",
          boxShadow: "sm",
          bg: "brand.surface",
          borderColor: "brand.border",
          borderWidth: "1px",
        },
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
