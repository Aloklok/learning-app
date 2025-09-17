import { createTheme, ThemeOptions, responsiveFontSizes } from '@mui/material/styles';
import palette from './palette';
import shadows from './shadows';
import getComponentStyles from './components';
import { designSystem } from './designSystem';

const typography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.3
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.3
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.4
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.4
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.875rem'
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};

const createCustomTheme = (mode: 'light' | 'dark') => {
  const themeOptions: ThemeOptions = {
    palette: palette(mode),
    typography,
    shape: {
      borderRadius: parseInt(designSystem.borderRadius.md)
    },
    // 添加自定义属性到主题
    customDesignSystem: designSystem
  };

  let theme = createTheme(themeOptions);
  theme = createTheme(theme, {
    shadows: shadows(mode),
    components: getComponentStyles(theme)
  });

  return responsiveFontSizes(theme);
};

export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');

// 导出设计系统供组件使用
export { designSystem } from './designSystem';