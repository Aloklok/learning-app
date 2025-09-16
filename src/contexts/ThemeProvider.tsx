import React, { useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../store/appStore';
import { ThemeContext } from './ThemeContext';

// 导入 Material Kit 2 主题和函数
import lightThemeConfig from '@mk_assets/theme';
import * as themeFunctions from '@mk_assets/theme/functions';

// 创建包含自定义函数的完整亮色主题
const baseLightTheme = createTheme({
  ...lightThemeConfig,
  functions: themeFunctions, // <--- 注入函数
});

// 创建包含自定义函数的完整暗色主题
const baseDarkTheme = createTheme({
  ...lightThemeConfig,
  functions: themeFunctions, // <--- 注入函数
  palette: {
    ...lightThemeConfig.palette,
    mode: 'dark',
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
    background: { default: '#0a0a0a', paper: '#1a1a1a' },
    text: { primary: '#ffffff', secondary: 'rgba(255, 255, 255, 0.7)' },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    ...lightThemeConfig.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121218', 
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.15) 0%, transparent 50%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e24', 
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e24', 
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0f0f0f',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MKBox: {
      styleOverrides: {
        root: {
          '&.sidebar': {
            background: 'linear-gradient(135deg, #1e1e24 0%, #26262d 100%)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
          },
          '&.main-bg': {
            background: 'linear-gradient(135deg, #121218 0%, #1a1a20 50%, #1e1e24 100%)',
          },
          '&.stats-card': {
            background: 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          },
          '&.jlpt-card': {
            background: 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          },
          '&.word-card': {
            background: 'linear-gradient(135deg, #242429 0%, #2a2a30 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2a2a30 0%, #303037 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.12)',
            },
          },
        },
      },
    },
  },
});


// 内部组件，用于访问Zustand store
const ThemeProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDarkMode, toggleTheme } = useAppStore(
    useShallow((state) => ({ 
      isDarkMode: state.isDarkMode, 
      toggleTheme: state.toggleTheme 
    }))
  );
  
  // 使用 useMemo 缓存主题对象，避免不必要的重渲染
  const currentTheme = useMemo(
    () => (isDarkMode ? baseDarkTheme : baseLightTheme),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// 外部ThemeProvider，不依赖任何store
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProviderInner>{children}</ThemeProviderInner>;
};