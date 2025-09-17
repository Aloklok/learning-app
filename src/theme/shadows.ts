// 创建阴影数组工具函数
function createShadow(
  umbra: string,
  penumbra: string,
  ambient: string
): string {
  return [
    `${umbra}px ${umbra}px ${umbra * 2}px 0 rgba(0,0,0,${0.2 - umbra * 0.0095})`,
    `${penumbra}px ${penumbra}px ${penumbra * 2}px 0 rgba(0,0,0,${0.14 - penumbra * 0.0019})`,
    `${ambient}px ${ambient}px ${ambient * 3}px 0 rgba(0,0,0,${0.12 - ambient * 0.0015})`
  ].join(',');
}

// 浅色主题阴影
const LIGHT_SHADOWS = [
  'none',
  createShadow(0, 1, 1),      // 1
  createShadow(0, 2, 2),      // 2
  createShadow(0, 3, 4),      // 3
  createShadow(0, 4, 5),      // 4
  createShadow(0, 5, 8),      // 5
  createShadow(0, 6, 10),     // 6
  createShadow(0, 7, 10),     // 7
  createShadow(0, 8, 10),     // 8
  createShadow(0, 9, 12),     // 9
  createShadow(0, 10, 14),    // 10
  createShadow(0, 11, 15),    // 11
  createShadow(0, 12, 17),    // 12
  createShadow(0, 13, 19),    // 13
  createShadow(0, 14, 21),    // 14
  createShadow(0, 15, 22),    // 15
  createShadow(0, 16, 24),    // 16
  createShadow(0, 17, 26),    // 17
  createShadow(0, 18, 28),    // 18
  createShadow(0, 19, 29),    // 19
  createShadow(0, 20, 31),    // 20
  createShadow(0, 21, 33),    // 21
  createShadow(0, 22, 35),    // 22
  createShadow(0, 23, 36),    // 23
  createShadow(0, 24, 38),    // 24
];

// 深色主题阴影
const DARK_SHADOWS = [
  'none',
  createShadow(0, 2, 2),      // 1
  createShadow(0, 3, 3),      // 2
  createShadow(0, 4, 5),      // 3
  createShadow(0, 5, 6),      // 4
  createShadow(0, 6, 9),      // 5
  createShadow(0, 7, 11),     // 6
  createShadow(0, 8, 11),     // 7
  createShadow(0, 9, 11),     // 8
  createShadow(0, 10, 13),    // 9
  createShadow(0, 11, 15),    // 10
  createShadow(0, 12, 16),    // 11
  createShadow(0, 13, 18),    // 12
  createShadow(0, 14, 20),    // 13
  createShadow(0, 15, 22),    // 14
  createShadow(0, 16, 23),    // 15
  createShadow(0, 17, 25),    // 16
  createShadow(0, 18, 27),    // 17
  createShadow(0, 19, 29),    // 18
  createShadow(0, 20, 30),    // 19
  createShadow(0, 21, 32),    // 20
  createShadow(0, 22, 34),    // 21
  createShadow(0, 23, 36),    // 22
  createShadow(0, 24, 37),    // 23
  createShadow(0, 25, 39),    // 24
];

// 特殊用途阴影
const LIGHT_CUSTOM = {
  primary: '0 8px 16px 0 rgba(24, 144, 255, 0.24)',
  info: '0 8px 16px 0 rgba(0, 184, 217, 0.24)',
  success: '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
  warning: '0 8px 16px 0 rgba(255, 171, 0, 0.24)',
  error: '0 8px 16px 0 rgba(255, 72, 66, 0.24)',
};

const DARK_CUSTOM = {
  primary: '0 8px 16px 0 rgba(24, 144, 255, 0.32)',
  info: '0 8px 16px 0 rgba(0, 184, 217, 0.32)',
  success: '0 8px 16px 0 rgba(0, 171, 85, 0.32)',
  warning: '0 8px 16px 0 rgba(255, 171, 0, 0.32)',
  error: '0 8px 16px 0 rgba(255, 72, 66, 0.32)',
};

interface CustomShadows {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

export default function shadows(mode: 'light' | 'dark'): (string | undefined)[] & { custom?: CustomShadows } {
  const shadows = mode === 'light' ? LIGHT_SHADOWS : DARK_SHADOWS;
  (shadows as any).custom = mode === 'light' ? LIGHT_CUSTOM : DARK_CUSTOM;
  return shadows;
}