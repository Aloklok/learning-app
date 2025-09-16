// src/store/appStore.ts
// 统一的应用状态管理

// src/store/appStore.ts
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
// 主题状态
interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// 布局状态
interface LayoutState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

// 学习状态
interface StudyState {
  currentCourse: number | null;
  currentLesson: number | null;
  showTranslation: boolean;
  setCurrentCourse: (courseId: number | null) => void;
  setCurrentLesson: (lessonId: number | null) => void;
  setShowTranslation: (show: boolean) => void;
  toggleTranslation: () => void;
}

// AI助手状态
interface AIState {
  isOpen: boolean;
  messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

// 提醒状态
interface ReminderState {
  reminders: Array<{
    id: string;
    type: 'review' | 'study';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    dueTime: Date;
    isRead: boolean;
  }>;
  showReminders: boolean;
  addReminder: (reminder: Omit<ReminderState['reminders'][0], 'id' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  removeReminder: (id: string) => void;
  setShowReminders: (show: boolean) => void;
}

// 组合所有状态
type AppState = ThemeState & LayoutState & StudyState & AIState & ReminderState;

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        // 主题状态
        isDarkMode: false,
        toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
        setTheme: (isDark) => set({ isDarkMode: isDark }),

        // 布局状态
        sidebarOpen: true,
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // 学习状态
        currentCourse: null,
        currentLesson: null,
        showTranslation: false,
        setCurrentCourse: (courseId) => set({ currentCourse: courseId }),
        setCurrentLesson: (lessonId) => set({ currentLesson: lessonId }),
        setShowTranslation: (show) => set({ showTranslation: show }),
        toggleTranslation: () => set((state) => ({ showTranslation: !state.showTranslation })),

        // AI助手状态
        isOpen: false,
        messages: [],
        isLoading: false,
        setOpen: (open) => set({ isOpen: open }),
        addMessage: (role, content) => set((state) => ({
          messages: [...state.messages, { role, content, timestamp: new Date() }]
        })),
        setLoading: (loading) => set({ isLoading: loading }),
        clearMessages: () => set({ messages: [] }),

        // 提醒状态
        reminders: [],
        showReminders: true,
        addReminder: (reminder) => set((state) => ({
          reminders: [...state.reminders, {
            ...reminder,
            id: Date.now().toString(),
            isRead: false
          }]
        })),
        markAsRead: (id) => set((state) => ({
          reminders: state.reminders.map(r => r.id === id ? { ...r, isRead: true } : r)
        })),
        removeReminder: (id) => set((state) => ({
          reminders: state.reminders.filter(r => r.id !== id)
        })),
        setShowReminders: (show) => set({ showReminders: show }),
      }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        sidebarOpen: state.sidebarOpen,
        showTranslation: state.showTranslation,
        showReminders: state.showReminders,
      }),
    }
    )
  )
);

// 选择器函数 - 缓存的选择器避免重复创建
const themeSelector = (state: AppState) => ({
  isDarkMode: state.isDarkMode,
  toggleTheme: state.toggleTheme,
  setTheme: state.setTheme,
});

const layoutSelector = (state: AppState) => ({
  sidebarOpen: state.sidebarOpen,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
});

const studySelector = (state: AppState) => ({
  currentCourse: state.currentCourse,
  currentLesson: state.currentLesson,
  showTranslation: state.showTranslation,
  setCurrentCourse: state.setCurrentCourse,
  setCurrentLesson: state.setCurrentLesson,
  setShowTranslation: state.setShowTranslation,
  toggleTranslation: state.toggleTranslation,
});

const aiSelector = (state: AppState) => ({
  isOpen: state.isOpen,
  messages: state.messages,
  isLoading: state.isLoading,
  setOpen: state.setOpen,
  addMessage: state.addMessage,
  setLoading: state.setLoading,
  clearMessages: state.clearMessages,
});

const remindersSelector = (state: AppState) => ({
  reminders: state.reminders,
  showReminders: state.showReminders,
  addReminder: state.addReminder,
  markAsRead: state.markAsRead,
  removeReminder: state.removeReminder,
  setShowReminders: state.setShowReminders,
});

// 2. Export hooks using useShallow for proper state selection
export const useTheme = () => useAppStore(useShallow(themeSelector));
export const useLayout = () => useAppStore(useShallow(layoutSelector));
export const useStudy = () => useAppStore(useShallow(studySelector));
export const useAI = () => useAppStore(useShallow(aiSelector));
export const useReminders = () => useAppStore(useShallow(remindersSelector));