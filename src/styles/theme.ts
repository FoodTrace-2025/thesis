// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#2F7D32",      // 主按钮、主操作（绿色）
      secondary: "#6DBE45", // hover / icon 用的浅绿
      accent: "#EA580C",       // 高亮 / 链接（例如 Forgot password）
      dark: "#1F2937",         // 主要文字
      muted: "#6B7280",        // 次要文字
      border: "#D1D5DB",       // 输入框 / 卡片边框
      surface: "#FFFFFF",      // 白色卡片
      surfaceAlt: "#E9F6E2",   // 左边大块淡绿背景 / 选中
      pageBg: "#FFF6DA",       // 页面淡黄背景
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
      variant: "solid",   // 不写 variant 时，默认就是绿色实心按钮
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
          bg: "brand.light",
          color: "brand.dark",
          borderWidth: "1px",
          borderColor: "brand.border",
          _hover: {
            bg: "brand.surfaceAlt",
          },
          _disabled: {
            bg: "brand.light",
            opacity: 0.6,
            cursor: "not-allowed",
          },
        },
      },
    },

    Input: {
      defaultProps: {
        bg: "brand.light",
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
          color: "brand.dark", // 文字颜色（可选）
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
