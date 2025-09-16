// src/types/models.d.ts

export interface Book {
  id: number;
  title: string;
}

export interface Lesson {
  id: number;
  book_id: number;
  lesson_number: number;
  title: string;
}

export interface VocabularyItem {
  id: number;
  word: string;
  kana: string;
  meaning: string;
  part_of_speech?: string;
  mastery_level: number;
  last_reviewed_at?: string;
  next_review_at?: string;
}

export interface GrammarItem {
  id: number;
  title: string;
  explanation: string;
  mastery_level: number;
  last_reviewed_at?: string;
  next_review_at?: string;
}

export interface TextItem {
  id: number;
  type: string;
  content_jp?: string;
  content_cn?: string;
}

export interface ArticleItem {
  id: number;
  title: string;
  content_jp: string;
  content_cn?: string;
}

// --- Dashboard Stats Interfaces ---
export interface VocabStats {
  total: number;
  mastered: number;
  familiar: number;
  unknown: number;
}

export interface GrammarStats {
  total: number;
  mastered: number;
  familiar: number;
  unknown: number;
}

export interface ProgressByLevel {
  N5: { mastered: number; total: number; };
  N4: { mastered: number; total: number; };
  N3: { mastered: number; total: number; };
  N2: { mastered: number; total: number; };
  N1: { mastered: number; total: number; };
}

export interface DashboardStats {
  vocabStats: VocabStats;
  grammarStats: GrammarStats;
  completedLessons: number;
  progressByLevel: ProgressByLevel;
}

// --- Database API Interface (matches preload.ts window.db exposure) ---
export interface DatabaseAPI {
  getInitialWords: () => Promise<VocabularyItem[]>;
  updateMasteryLevel: (wordId: number, newLevel: number) => Promise<{ success: boolean }>;
  getTodaysReviewCards: () => Promise<VocabularyItem[]>;
  getAllBooks: () => Promise<Book[]>;
  getLessonsByBookId: (bookId: number) => Promise<Lesson[]>;
  getLessonById: (lessonId: number) => Promise<Lesson | null>;
  markLessonAsComplete: (lessonId: number) => Promise<{ success: boolean }>;
  getTextsByLessonId: (lessonId: number) => Promise<TextItem[]>;
  getVocabularyByLessonId: (lessonId: number) => Promise<VocabularyItem[]>;
  getGrammarByLessonId: (lessonId: number) => Promise<GrammarItem[]>;
  getArticlesByLessonId: (lessonId: number) => Promise<ArticleItem[]>;
  importBook: (bookData: unknown) => Promise<{ success: boolean; message?: string }>;
  updateGrammarMasteryLevel: (grammarId: number, newLevel: number) => Promise<{ success: boolean }>;
  getTodaysReviewGrammar: () => Promise<GrammarItem[]>;
  getCompletedLessons: () => Promise<number[]>;
  unlockNextLesson: (currentLessonId: number) => Promise<{ success: boolean; unlockedLessonId: number | null }>;
  getDashboardStats: () => Promise<DashboardStats>;
  getNeighborLessons: (lessonId: number) => Promise<Lesson[]>;
  getCurrentLearningState: () => Promise<{ currentLesson: Lesson; book: Book } | null>;
  getDueVocabulary: () => Promise<VocabularyItem[]>;
  getDueGrammar: () => Promise<GrammarItem[]>;
  getLessonAndBookInfo: (lessonId: number) => Promise<{ lesson: Lesson; book: Book } | null>;
  getAllVocabulary: () => Promise<VocabularyItem[]>;
  getAllGrammar: () => Promise<GrammarItem[]>;
  batchUpdateReviewItems: (items: any[]) => Promise<{ success: boolean }>;
}

// --- Speech Recognition API Interface ---
export interface SpeechAPI {
  startRecognition: (language: string) => void;
  stopRecognition: () => void;
  onRecognitionStarted: (callback: () => void) => void;
  onRecognitionStopped: (callback: () => void) => void;
  onSpeechResult: (callback: (value: string) => void) => void;
  onSpeechError: (callback: (value: string) => void) => void;
  requestAuthorization: () => Promise<boolean>;
  // Window controls (matching preload.ts)
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

// --- AI Assistant API Interface ---
export interface AIAPI {
  ask: (prompt: string) => Promise<string>;
}

// --- Legacy alias for backward compatibility ---
export type ElectronAPI = DatabaseAPI;

// --- Global Window Extensions ---
declare global {
  interface Window {
    db: DatabaseAPI;
    ai: AIAPI;
    electronAPI: SpeechAPI;
  }
}
