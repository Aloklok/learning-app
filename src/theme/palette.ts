import { PaletteOptions } from '@mui/material/styles';

// 定义主要颜色
const colors = {
  primary: {
    lighter: '#E3F2FD', // 清新的浅蓝色
    light: '#90CAF9',   // 天空蓝
    main: '#2196F3',    // 明亮的蓝色
    dark: '#1976D2',    // 深邃的蓝色
    darker: '#0D47A1',  // 海军蓝
    alpha: 'rgba(33, 150, 243, 0.1)' // 透明主色调
  },
  secondary: {
    lighter: '#EDE7F6', // 淡紫色
    light: '#B39DDB',   // 薰衣草色
    main: '#673AB7',    // 优雅的紫色
    dark: '#512DA8',    // 深紫色
    darker: '#311B92',  // 皇家紫
    alpha: 'rgba(103, 58, 183, 0.1)'
  },
  success: {
    lighter: '#E8F5E9', // 淡绿色
    light: '#81C784',   // 柔和的绿色
    main: '#4CAF50',    // 清新的绿色
    dark: '#388E3C',    // 森林绿
    darker: '#1B5E20',  // 深绿色
    alpha: 'rgba(76, 175, 80, 0.1)'
  },
  warning: {
    lighter: '#FFF3E0', // 米色
    light: '#FFB74D',   // 柔和的橙色
    main: '#FF9800',    // 温暖的橙色
    dark: '#F57C00',    // 深橙色
    darker: '#E65100',  // 赤橙色
    alpha: 'rgba(255, 152, 0, 0.1)'
  },
  error: {
    lighter: '#FFEBEE', // 淡玫瑰色
    light: '#E57373',   // 柔和的红色
    main: '#F44336',    // 鲜艳的红色
    dark: '#D32F2F',    // 深红色
    darker: '#B71C1C',  // 暗红色
    alpha: 'rgba(244, 67, 54, 0.1)'
  },
  info: {
    lighter: '#E1F5FE', // 淡蓝色
    light: '#4FC3F7',   // 清爽的蓝色
    main: '#03A9F4',    // 信息蓝
    dark: '#0288D1',    // 深蓝色
    darker: '#01579B',  // 靛蓝色
    alpha: 'rgba(3, 169, 244, 0.1)'
  },
  grey: {
    0: '#FFFFFF',    // 纯白
    50: '#FAFAFA',   // 烟白
    100: '#F5F5F5',  // 雪白
    200: '#EEEEEE',  // 珍珠白
    300: '#E0E0E0',  // 银白
    400: '#BDBDBD',  // 淡灰
    500: '#9E9E9E',  // 中灰
    600: '#757575',  // 铅灰
    700: '#616161',  // 深灰
    800: '#424242',  // 炭灰
    900: '#212121',  // 石墨黑
  },
};

// 定义渐变色
const gradients = {
  primary: 'linear-gradient(120deg, #2196F3 0%, #1976D2 100%)',     // 蓝色渐变
  secondary: 'linear-gradient(120deg, #673AB7 0%, #512DA8 100%)',    // 紫色渐变
  success: 'linear-gradient(120deg, #4CAF50 0%, #388E3C 100%)',     // 绿色渐变
  warning: 'linear-gradient(120deg, #FF9800 0%, #F57C00 100%)',     // 橙色渐变
  error: 'linear-gradient(120deg, #F44336 0%, #D32F2F 100%)',       // 红色渐变
  info: 'linear-gradient(120deg, #03A9F4 0%, #0288D1 100%)',        // 信息蓝渐变
  cool: 'linear-gradient(120deg, #2196F3 0%, #673AB7 100%)',        // 冷色调渐变
  warm: 'linear-gradient(120deg, #FF9800 0%, #F44336 100%)',        // 暖色调渐变
  night: 'linear-gradient(120deg, #424242 0%, #212121 100%)',       // 夜晚渐变
  dawn: 'linear-gradient(120deg, #FF9800 0%, #2196F3 100%)',        // 黎明渐变
  silver: 'linear-gradient(120deg, #FAFAFA 0%, #E0E0E0 100%)',      // 银色渐变
  cosmic: 'linear-gradient(120deg, #673AB7 0%, #03A9F4 100%)'       // 宇宙渐变
};

// 明亮主题调色板
const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    ...colors.primary,
    contrastText: '#fff'
  },
  secondary: {
    ...colors.secondary,
    contrastText: '#fff'
  },
  success: {
    ...colors.success,
    contrastText: '#fff'
  },
  warning: {
    ...colors.warning,
    contrastText: colors.grey[800]
  },
  error: {
    ...colors.error,
    contrastText: '#fff'
  },
  info: {
    ...colors.info,
    contrastText: '#fff'
  },
  grey: colors.grey,
  background: {
    default: colors.grey[50],    // 更浅的背景色
    paper: '#fff'               // 纯白纸张背景
  },
  text: {
    primary: colors.grey[900],   // 更深的主要文本颜色
    secondary: colors.grey[700], // 更深的次要文本颜色
    disabled: colors.grey[500]   // 禁用状态文本颜色
  },
  divider: colors.grey[200],    // 更柔和的分割线
  action: {
    active: colors.grey[700],   // 更深的激活状态
    hover: colors.grey[100],    // 更柔和的悬停效果
    selected: colors.grey[200], // 选中状态
    disabled: colors.grey[400], // 禁用状态
    disabledBackground: colors.grey[200], // 禁用背景
    focus: colors.grey[200]     // 聚焦状态
  }
};

// 定义暗色主题调色板
export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    ...colors.primary,
    contrastText: '#fff',
  },
  secondary: {
    ...colors.secondary,
    contrastText: '#fff',
  },
  success: {
    ...colors.success,
    contrastText: '#fff',
  },
  warning: {
    ...colors.warning,
    contrastText: '#212B36',
  },
  error: {
    ...colors.error,
    contrastText: '#fff',
  },
  info: {
    ...colors.info,
    contrastText: '#fff',
  },
  grey: colors.grey,
  background: {
    default: '#18181B',         // 更现代的深色背景
    paper: '#27272A'           // 稍微亮一点的纸张背景
  },
  text: {
    primary: colors.grey[50],    // 近白色的主要文本
    secondary: colors.grey[400], // 柔和的次要文本
    disabled: colors.grey[600]   // 暗灰的禁用文本
  },
  divider: colors.grey[800],    // 深色分割线
  action: {
    active: colors.grey[300],   // 明显的激活状态
    hover: colors.grey[800],    // 深色悬停效果
    selected: colors.grey[700], // 选中状态
    disabled: colors.grey[700], // 禁用状态
    disabledBackground: colors.grey[800], // 禁用背景
    focus: colors.grey[700]     // 聚焦状态
  },
};

export { colors, gradients };

export default function palette(mode: 'light' | 'dark'): PaletteOptions {
  return mode === 'light' ? lightPalette : darkPalette;
}