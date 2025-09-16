// src/types/SpeechRecognition.ts

// 语音识别实例类型
export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
}

// 语音识别事件类型
export interface SpeechRecognitionEvent extends Event { // <-- 确保继承自 Event
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

// 语音识别结果列表类型
export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResultItem;
  [index: number]: SpeechRecognitionResultItem;
}

// 语音识别结果项类型
export interface SpeechRecognitionResultItem {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean; // <-- 确保 isFinal 是 boolean
}

// 语音识别替代结果类型
export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// 语音识别错误事件类型
export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// 全局Window接口扩展
export interface SpeechRecognitionWindow extends Window {
  SpeechRecognition: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition: new () => SpeechRecognitionInstance;
}

// 最终的、完整的复习结果类型 (从组件中移过来)
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  accuracy: number;
  feedback: string;
  isCorrect: boolean;
}