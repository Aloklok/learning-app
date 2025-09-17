import { useAppStore } from '../store/appStore';

export const useThemeMode = () => {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const setTheme = useAppStore((state) => state.setTheme);
  
  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  };
};