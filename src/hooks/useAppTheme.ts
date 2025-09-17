import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../store/appStore';

/**
 * 统一的主题API Hook
 * 基于项目的Zustand架构，提供所有主题相关功能的单一入口
 * 
 * 符合项目原则：
 * - Zustand为核心的状态管理
 * - 统一状态架构 
 * - 单一来源的配置
 */
export const useAppTheme = () => {
  return useAppStore(
    useShallow((state) => ({
      // 主题状态
      isDarkMode: state.isDarkMode,
      
      // 主题操作
      toggleTheme: state.toggleTheme,
      setTheme: state.setTheme,
    }))
  );
};

/**
 * 使用示例：
 * 
 * const { isDarkMode, toggleTheme, setTheme } = useAppTheme();
 * 
 * // 切换主题
 * toggleTheme();
 * 
 * // 设置特定主题
 * setTheme(true);  // 暗色模式
 * setTheme(false); // 亮色模式
 */