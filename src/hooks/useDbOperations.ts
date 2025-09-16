// src/hooks/useDbOperations.ts
import { useCallback } from 'react';

/**
 * A custom hook that provides a stable, memoized API for all database operations.
 * This avoids components needing to call window.db directly and ensures type safety.
 */
export const useDbOperations = () => {
  const getAllBooks = useCallback(async () => {
    if (!window.db?.getAllBooks) throw new Error('getAllBooks is not available');
    return window.db.getAllBooks();
  }, []);

  const getLessonsByBookId = useCallback(async (bookId: number) => {
    if (!window.db?.getLessonsByBookId) throw new Error('getLessonsByBookId is not available');
    return window.db.getLessonsByBookId(bookId);
  }, []);
  
  const getLessonById = useCallback(async (lessonId: number) => {
    if (!window.db?.getLessonById) throw new Error('getLessonById is not available');
    return window.db.getLessonById(lessonId);
  }, []);

  const updateMasteryLevel = useCallback(async (wordId: number, newLevel: number) => {
    if (!window.db?.updateMasteryLevel) throw new Error('updateMasteryLevel is not available');
    await window.db.updateMasteryLevel(wordId, newLevel);
  }, []);

  const updateGrammarMasteryLevel = useCallback(async (grammarId: number, newLevel: number) => {
    if (!window.db?.updateGrammarMasteryLevel) throw new Error('updateGrammarMasteryLevel is not available');
    await window.db.updateGrammarMasteryLevel(grammarId, newLevel);
  }, []);
  
  const markLessonAsComplete = useCallback(async (lessonId: number) => {
    if (!window.db?.markLessonAsComplete) throw new Error('markLessonAsComplete is not available');
    return window.db.markLessonAsComplete(lessonId);
  }, []);

  const importBook = useCallback(async (bookData: unknown) => {
    if (!window.db?.importBook) throw new Error('importBook is not available');
    return window.db.importBook(bookData);
  }, []);

  // ... you can add all other db functions here in the same pattern

  return {
    getAllBooks,
    getLessonsByBookId,
    getLessonById,
    updateMasteryLevel,
    updateGrammarMasteryLevel,
    markLessonAsComplete,
    importBook,
  };
};
