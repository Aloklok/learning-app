// 设计系统规范 - 统一的间距、尺寸和布局常量
export const designSystem = {
  // 间距系统 (基于8px网格)
  spacing: {
    xs: '4px',    // 0.5 * 8px
    sm: '8px',    // 1 * 8px  
    md: '16px',   // 2 * 8px
    lg: '24px',   // 3 * 8px
    xl: '32px',   // 4 * 8px
    xxl: '48px',  // 6 * 8px
    xxxl: '64px'  // 8 * 8px
  },

  // 圆角系统
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    round: '50%'
  },

  // 阴影层级
  elevation: {
    card: {
      rest: {
        light: '0 4px 16px rgba(0, 0, 0, 0.08)',
        dark: '0 4px 16px rgba(0, 0, 0, 0.4)'
      },
      hover: {
        light: '0 8px 32px rgba(0, 0, 0, 0.15)',
        dark: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }
    },
    modal: {
      light: '0 12px 48px rgba(0, 0, 0, 0.2)',
      dark: '0 12px 48px rgba(0, 0, 0, 0.8)'
    },
    fab: {
      rest: {
        light: '0 4px 16px rgba(0, 0, 0, 0.12)',
        dark: '0 4px 16px rgba(0, 0, 0, 0.4)'
      },
      hover: {
        light: '0 6px 20px rgba(0, 0, 0, 0.15)',
        dark: '0 6px 20px rgba(0, 0, 0, 0.5)'
      }
    }
  },

  // 动画时长
  animation: {
    fast: '0.15s',
    normal: '0.2s',
    slow: '0.3s',
    spring: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },

  // 学习应用特定的UI规范
  learningApp: {
    // 卡片尺寸
    cardSizes: {
      wordCard: {
        minHeight: '180px',
        maxWidth: '300px'
      },
      lessonCard: {
        minHeight: '120px'
      }
    },
    
    // 字体权重
    fontWeights: {
      japanese: {
        word: 700,      // 日语单词 - 醒目
        reading: 500,   // 假名读音 - 中等
        meaning: 500    // 中文释义 - 中等
      },
      interface: {
        heading: 600,   // 标题
        body: 400,      // 正文
        caption: 500    // 说明文字
      }
    },

    // 学习状态颜色
    masteryColors: {
      unknown: '#f44336',    // 红色 - 不熟悉
      learning: '#ff9800',   // 橙色 - 学习中  
      mastered: '#4caf50'    // 绿色 - 已掌握
    },

    // 功能颜色
    actions: {
      speech: '#2196f3',     // 语音相关 - 蓝色
      copy: '#9c27b0',       // 复制功能 - 紫色
      practice: '#ff5722'    // 练习功能 - 深橙色
    }
  }
} as const;

// 主题模式相关的辅助函数
export const getThemedValue = (light: string, dark: string, isDark: boolean) => {
  return isDark ? dark : light;
};

// 获取阴影值的辅助函数  
export const getElevation = (
  type: keyof typeof designSystem.elevation,
  state: 'rest' | 'hover' = 'rest',
  isDark: boolean = false
) => {
  const elevation = designSystem.elevation[type];
  if (typeof elevation === 'object' && 'rest' in elevation) {
    const stateElevation = elevation[state];
    return getThemedValue(stateElevation.light, stateElevation.dark, isDark);
  }
  return getThemedValue(elevation.light, elevation.dark, isDark);
};