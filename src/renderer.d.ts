// src/renderer.d.ts

// --- 在这里定义所有从后端返回的数据结构接口 ---
interface Book {
  id: number;
  title: string;
  description?: string;
}

interface Lesson {
  id: number;
  book_id: number;
  lesson_number: number;
  title: string;
}

interface VocabularyItem {
  id: number;
  word: string;
  kana: string;
  meaning: string;
  part_of_speech?: string;
  mastery_level: number;
  last_reviewed_at?: string;
  next_review_at?: string;
}

interface GrammarItem {
  id: number;
  lesson_id: number;
  title: string;
  explanation: string;
  mastery_level: number;
  last_reviewed_at?: string;
  next_review_at?: string;
}

interface LessonText {
  id: number;
  lesson_id: number;
  type: string;
  content_jp?: string;
  content_cn?: string;
}

interface ArticleItem {
  id: number;
  lesson_id?: number;
  title: string;
  content_jp: string;
  content_cn?: string;
  source?: string;
  tags?: string;
}

// --- 扩展现有的 Window 接口 ---
export interface IElectronAPI {
  db: {
    // --- 确保所有函数都已声明并使用正确的类型 ---
    getAllBooks: () => Promise<Book[]>;
    getLessonsByBookId: (bookId: number) => Promise<Lesson[]>;
    getLessonById: (lessonId: number) => Promise<Lesson | null>; // 修正点 1
    
    getVocabularyByLessonId: (lessonId: number) => Promise<VocabularyItem[]>;
    getGrammarByLessonId: (lessonId: number) => Promise<GrammarItem[]>;
    getTextsByLessonId: (lessonId: number) => Promise<LessonText[]>;
    getArticlesByLessonId: (lessonId: number) => Promise<ArticleItem[]>;

    getTodaysReviewCards: () => Promise<VocabularyItem[]>;
    getTodaysReviewGrammar: () => Promise<GrammarItem[]>;

    updateMasteryLevel: (wordId: number, newLevel: number) => Promise<{ success: boolean }>;
    updateGrammarMasteryLevel: (grammarId: number, newLevel: number) => Promise<{ success: boolean }>; // 修正点 2

    importBook: (bookData: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
    // 在 renderer.d.ts 的 db 接口中添加一行
markLessonAsComplete: (lessonId: number) => Promise<{ success: boolean }>;
getCompletedLessons: () => Promise<number[]>;
unlockNextLesson: (currentLessonId: number) => Promise<{ success: boolean; unlockedLessonId: number | null }>;
getDashboardStats: () => Promise<{
  masteredWords: number;
  totalWords: number;
  masteredGrammar: number;
  completedLessons: number;
}>;  


};
  ai: {
    ask: (prompt: string) => Promise<string>;
  };
}

declare global {
  interface Window {
    db: IElectronAPI['db'];
    ai: IElectronAPI['ai'];
  }
}