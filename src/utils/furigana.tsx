// src/utils/furigana.tsx (V-Final-Robust-Split - 最可靠的分割法)

import React from 'react';

export function renderFurigana(text: string): React.ReactNode {
  if (!text || !text.includes('[')) {
    return text; // 如果没有注音标记，直接返回原始文本
  }

  const parts: React.ReactNode[] = [];
  // 使用正则表达式进行分割，保留分割符
  const segments = text.split(/([\u4e00-\u9faf\u3400-\u4dbf\uf900-\ufaff]+\[.*?\])/g);

  segments.forEach((segment, index) => {
    if (!segment) return; // 跳过空的分割结果

    // 尝试匹配 "汉字[假名]" 格式
    const match = segment.match(/([\u4e00-\u9faf\u3400-\u4dbf\uf900-\ufaff]+)\[(.*?)\]/);

    if (match) {
      const [, kanji, furigana] = match;
      parts.push(
        <ruby key={`${index}-${kanji}`}>
          {kanji}
          <rt>{furigana}</rt>
        </ruby>
      );
    } else {
      // 如果不匹配，就是普通文本
      parts.push(segment);
    }
  });

  return parts.map((part, index) => <React.Fragment key={index}>{part}</React.Fragment>);
}