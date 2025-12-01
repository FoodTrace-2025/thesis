// src/styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      primary: "#2F7D32",      // 主按钮、主操作（绿色）
      primaryLight: "#6DBE45", // hover / icon 用的浅绿
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
        colorScheme: "green",
      },
      baseStyle: {
        borderRadius: "md",
        fontWeight: "semibold",
      },
    },

    Input: {
      defaultProps: {
        focusBorderColor: 'green.500',
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
