/// <reference types="vite/client" />

import type { VocabularyItem, Book, Lesson, TextItem, GrammarItem, ArticleItem } from './types/models';

interface Window {
  db: {
    getInitialWords: () => Promise<VocabularyItem[]>;
    updateMasteryLevel: (wordId: number, newLevel: number) => Promise<{ success: boolean }>;
    getTodaysReviewCards: () => Promise<VocabularyItem[]>;
    getAllBooks: () => Promise<Book[]>;
    getLessonsByBookId: (bookId: number) => Promise<Lesson[]>;
    getLessonById: (lessonId: number) => Promise<Lesson>;
    markLessonAsComplete: (lessonId: number) => Promise<{ success: boolean }>;
    getTextsByLessonId: (lessonId: number) => Promise<TextItem[]>;
    getVocabularyByLessonId: (lessonId: number) => Promise<VocabularyItem[]>;
    getGrammarByLessonId: (lessonId: number) => Promise<GrammarItem[]>;
    getArticlesByLessonId: (lessonId: number) => Promise<ArticleItem[]>;
    importBook: (bookData: unknown) => Promise<{ success: boolean }>;
    updateGrammarMasteryLevel: (grammarId: number, newLevel: number) => Promise<{ success: boolean }>;
    getTodaysReviewGrammar: () => Promise<GrammarItem[]>;
    getCompletedLessons: () => Promise<number[]>;
    unlockNextLesson: (currentLessonId: number) => Promise<{ success: boolean }>;
    getDashboardStats: () => Promise<any>;
    getNeighborLessons: (lessonId: number) => Promise<{ prev?: Lesson; next?: Lesson }>;
    getCurrentLearningState: () => Promise<any>;
    getDueVocabulary: () => Promise<VocabularyItem[]>;
    getDueGrammar: () => Promise<GrammarItem[]>;
    getLessonAndBookInfo: (lessonId: number) => Promise<{ lesson: Lesson; book: Book }>;
  };
  ai: {
    ask: (prompt: string) => Promise<string>;
  };
  speech?: {
    startRecognition: (language?: string, targetText?: string) => Promise<any>;
    stopRecognition: () => Promise<any>;
    speak: (text: string, language?: string) => Promise<any>;
  };
}