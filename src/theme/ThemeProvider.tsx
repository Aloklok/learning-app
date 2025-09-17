import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../store/appStore';
import { lightTheme, darkTheme } from './index';

/**
 * 基于Zustand的轻量级主题提供者
 * 将appStore中的主题状态直接传递给MUI ThemeProvider
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 从Zustand store获取主题状态
  const isDarkMode = useAppStore(useShallow((state) => state.isDarkMode));
  
  // 缓存主题对象，避免不必要的重渲染
  const currentTheme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  return (
    <MuiThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};