// 全局类型声明文件

// 为缺少类型定义的第三方库提供基础声明
declare module 'diff' {
  export function diffChars(oldStr: string, newStr: string): Array<{
    value: string;
    added?: boolean;
    removed?: boolean;
  }>;
}

declare module 'chroma-js' {
  interface ChromaStatic {
    (color: string | number | number[]): ChromaJS;
    random(): ChromaJS;
    mix(color1: string, color2: string, f?: number): ChromaJS;
    scale(colors: string[]): (t: number) => ChromaJS;
  }
  
  interface ChromaJS {
    hex(): string;
    rgb(): number[];
    rgba(): number[];
    hsl(): number[];
    toString(): string;
    alpha(alpha?: number): ChromaJS;
    brighten(amount?: number): ChromaJS;
    darken(amount?: number): ChromaJS;
  }
  
  const chroma: ChromaStatic;
  export default chroma;
}

// 扩展 JSX.IntrinsicElements 以支持 Ruby 注音元素
declare namespace JSX {
  interface IntrinsicElements {
    ruby: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    rb: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    rt: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    rp: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}