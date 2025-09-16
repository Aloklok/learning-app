// electron/ipc/database.ts
import { ipcMain, dialog } from 'electron';
import type { Database } from 'better-sqlite3';

// 辅助函数: 记忆曲线计算
function calculateNextReviewDate(mastery_level: number): Date {
  const now = new Date();
  const nextReviewDate = new Date(now);
  switch (mastery_level) {
    case 0: nextReviewDate.setMinutes(now.getMinutes() + 5); break;
    case 1: nextReviewDate.setHours(now.getHours() + 24); break;
    case 2: nextReviewDate.setHours(now.getHours() + 72); break;
    default: nextReviewDate.setMinutes(now.getMinutes() + 5); break;
  }
  return nextReviewDate;
}

export function registerDatabaseIpcHandlers(db: Database) {
  ipcMain.handle('db:getAllBooks', async () => {
    try {
      const stmt = db.prepare('SELECT id, title, description FROM books');
      return stmt.all();
    } catch (error) {
      console.error("Failed to get all books:", error);
      throw error;
    }
  });

  ipcMain.handle('db:getLessonsByBookId', async (event, bookId: number) => {
    try {
      const stmt = db.prepare(`
        SELECT l.* FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.entity_id AND up.entity_type = 'lesson'
        WHERE l.book_id = ? AND (l.lesson_number = 1 OR up.id IS NOT NULL)
        ORDER BY l.lesson_number ASC
      `);
      const lessons = stmt.all(bookId);
      return lessons;
    } catch (error){
      console.error(`[IPC ERROR] Failed to get unlocked lessons for book ID ${bookId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getLessonById', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare('SELECT * FROM lessons WHERE id = ?');
      return stmt.get(lessonId);
    } catch (error) {
      console.error(`Failed to get lesson by ID ${lessonId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getTextsByLessonId', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare('SELECT * FROM texts WHERE lesson_id = ?');
      return stmt.all(lessonId);
    } catch (error) {
      console.error(`Failed to get texts for lesson ID ${lessonId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getVocabularyByLessonId', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare(`
        SELECT mv.* FROM master_vocabulary mv 
        JOIN lesson_vocabulary_link lvl ON mv.id = lvl.master_vocabulary_id 
        WHERE lvl.lesson_id = ?
      `);
      return stmt.all(lessonId);
    } catch (error) {
      console.error(`Failed to get vocabulary for lesson ID ${lessonId}:`, error);
      throw error;
    }
  });

  // 【修改】更新查询逻辑以使用新的 master_grammar 结构
  ipcMain.handle('db:getGrammarByLessonId', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare(`
        SELECT mg.* FROM master_grammar mg
        JOIN lesson_grammar_link lgl ON mg.id = lgl.master_grammar_id
        WHERE lgl.lesson_id = ?
      `);
      return stmt.all(lessonId);
    } catch (error) {
      console.error(`Failed to get grammar for lesson ID ${lessonId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getArticlesByLessonId', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare('SELECT * FROM articles WHERE lesson_id = ?');
      return stmt.all(lessonId);
    } catch (error) {
      console.error(`Failed to get articles for lesson ID ${lessonId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getLessonAndBookInfo', async (event, lessonId: number) => {
    if (!lessonId) return null;
    try {
      const lessonStmt = db.prepare('SELECT * FROM lessons WHERE id = ?');
      const lesson = lessonStmt.get(lessonId) as any;
      if (!lesson) return null;
      const bookStmt = db.prepare('SELECT id, title, description FROM books WHERE id = ?');
      const book = bookStmt.get(lesson.book_id) as any;
      return { lesson, book };
    } catch (error) {
      console.error(`[IPC ERROR] Failed to get lesson and book info for lesson ID ${lessonId}:`, error);
      throw error;
    }
  });

  async function getTodaysReviewCardsLogic(limit = 10) {
    try {
      const now = new Date().toISOString();
      const sql = `SELECT * FROM master_vocabulary WHERE next_review_at <= ? ORDER BY next_review_at ASC LIMIT ?`;
      const stmt = db.prepare(sql);
      return stmt.all(now, Number(limit));
    } catch (error) {
      console.error("Failed to get today's review cards:", error);
      throw error;
    }
  }

  ipcMain.handle('db:getTodaysReviewCards', async (event, limit = 10) => {
    return getTodaysReviewCardsLogic(limit);
  });

  ipcMain.handle('db:getDueVocabulary', (event, limit = 10) => {
    return getTodaysReviewCardsLogic(limit);
  });

  // 【修改】更新批量更新逻辑以指向 master_grammar
  ipcMain.handle('db:batchUpdateReviewItems', async (event, itemsToUpdate) => {
    const transaction = db.transaction((items) => {
      const updateVocabStmt = db.prepare(
        'UPDATE master_vocabulary SET mastery_level = ?, last_reviewed_at = ?, next_review_at = ? WHERE id = ?'
      );
      const updateGrammarStmt = db.prepare(
        'UPDATE master_grammar SET mastery_level = ?, last_reviewed_at = ?, next_review_at = ? WHERE id = ?'
      );
      for (const item of items) {
        const now = new Date();
        const nextReview = calculateNextReviewDate(item.masteryLevel);
        if (item.entityType === 'vocabulary') {
          updateVocabStmt.run(item.masteryLevel, now.toISOString(), nextReview.toISOString(), item.id);
        } else if (item.entityType === 'grammar') {
          updateGrammarStmt.run(item.masteryLevel, now.toISOString(), nextReview.toISOString(), item.id);
        }
      }
    });
    try {
      transaction(itemsToUpdate);
      return { success: true };
    } catch (error) {
      console.error('[IPC ERROR] Failed to batch update review items:', error);
      throw error;
    }
  });

  // 【修改】更新查询逻辑以使用 master_grammar
  async function getTodaysReviewGrammarLogic(limit = 10) {
    try {
        const now = new Date().toISOString();
        const sql = `SELECT * FROM master_grammar WHERE next_review_at <= ? ORDER BY next_review_at ASC LIMIT ?`;
        const stmt = db.prepare(sql);
        return stmt.all(now, Number(limit));
    } catch (error) {
        console.error("Failed to get today's review grammar:", error);
        throw error;
    }
  }

  ipcMain.handle('db:getTodaysReviewGrammar', (event, limit = 10) => {
    return getTodaysReviewGrammarLogic(limit);
  });

  ipcMain.handle('db:getDueGrammar', (event, limit = 10) => {
    return getTodaysReviewGrammarLogic(limit);
  });

  ipcMain.handle('db:updateMasteryLevel', async (event, wordId: number, newLevel: number) => {
    try {
      const now = new Date();
      const nextReview = calculateNextReviewDate(newLevel);
      const stmt = db.prepare('UPDATE master_vocabulary SET mastery_level = ?, last_reviewed_at = ?, next_review_at = ? WHERE id = ?');
      stmt.run(newLevel, now.toISOString(), nextReview.toISOString(), wordId);
      return { success: true };
    } catch (error) {
      console.error(`Failed to update mastery_level for word ID ${wordId}:`, error);
      throw error;
    }
  });

  // 【修改】更新函数以指向 master_grammar
  ipcMain.handle('db:updateGrammarMasteryLevel', async (event, grammarId: number, newLevel: number) => {
    try {
      const now = new Date();
      const nextReview = calculateNextReviewDate(newLevel);
      const stmt = db.prepare('UPDATE master_grammar SET mastery_level = ?, last_reviewed_at = ?, next_review_at = ? WHERE id = ?');
      stmt.run(newLevel, now.toISOString(), nextReview.toISOString(), grammarId);
      return { success: true };
    } catch (error) {
      console.error(`Failed to update mastery_level for grammar ID ${grammarId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getCurrentLearningState', async () => {
    try {
      const findUnlockedStmt = db.prepare(`
        SELECT l.* FROM lessons l
        JOIN user_progress up ON l.id = up.entity_id
        WHERE up.entity_type = 'lesson' AND up.status = 'unlocked'
        ORDER BY l.lesson_number ASC
        LIMIT 1
      `);
      let currentLesson = findUnlockedStmt.get() as any;

      if (!currentLesson) {
        const findLastCompletedStmt = db.prepare(`
          SELECT l.book_id, MAX(l.lesson_number) as last_lesson_number
          FROM lessons l
          JOIN user_progress up ON l.id = up.entity_id
          WHERE up.entity_type = 'lesson' AND up.status = 'completed'
        `);
        const lastCompleted = findLastCompletedStmt.get() as any;
        if (lastCompleted && lastCompleted.book_id) {
          const findNextStmt = db.prepare('SELECT * FROM lessons WHERE book_id = ? AND lesson_number = ?');
          currentLesson = findNextStmt.get(lastCompleted.book_id, lastCompleted.last_lesson_number + 1);
        }
      }

      if (!currentLesson) {
        const firstLessonStmt = db.prepare('SELECT * FROM lessons ORDER BY book_id ASC, lesson_number ASC LIMIT 1');
        currentLesson = firstLessonStmt.get();
      }
      
      if (currentLesson) {
        const bookStmt = db.prepare('SELECT title FROM books WHERE id = ?');
        const book = bookStmt.get(currentLesson.book_id);
        return { currentLesson, book };
      }
      
      return null;
    } catch (error) {
      console.error("[IPC ERROR] Failed to get current learning state:", error);
      throw error;
    }
  });

  // 【修改】重构导入逻辑以支持中央语法库
  ipcMain.handle('importer:importBook', async (event, bookData: any) => {
    try {
      const checkStmt = db.prepare('SELECT id FROM books WHERE title = ?');
      const existingBook = checkStmt.get(bookData.title);
      if (existingBook) {
        const message = `教材 "${bookData.title}" 已经存在。`;
        dialog.showErrorBox('导入失败', message);
        return { success: false, message };
      }
    } catch (error) {
      console.error("Check for existing book failed:", error);
      throw error;
    }

    const transaction = db.transaction(() => {
      // --- 准备所有 SQL 语句 ---
      const insertBook = db.prepare('INSERT INTO books (title, description) VALUES (?, ?)');
      const insertLesson = db.prepare('INSERT INTO lessons (book_id, lesson_number, title) VALUES (?, ?, ?)');
      
      // 词汇
      const findMasterVocabulary = db.prepare('SELECT id FROM master_vocabulary WHERE word = ?');
      const insertMasterVocabulary = db.prepare('INSERT INTO master_vocabulary (word, kana, meaning, part_of_speech, level) VALUES (?, ?, ?, ?, ?)');
      const linkLessonVocabulary = db.prepare('INSERT INTO lesson_vocabulary_link (lesson_id, master_vocabulary_id) VALUES (?, ?)');
      
      // 语法 (新)
      const findMasterGrammar = db.prepare('SELECT id FROM master_grammar WHERE title = ?');
      const insertMasterGrammar = db.prepare('INSERT INTO master_grammar (title, explanation, level) VALUES (?, ?, ?)');
      const linkLessonGrammar = db.prepare('INSERT INTO lesson_grammar_link (lesson_id, master_grammar_id) VALUES (?, ?)');

      // 其他
      const insertSentence = db.prepare('INSERT INTO sentences (vocabulary_id, grammar_id, sentence_jp, sentence_cn) VALUES (?, ?, ?, ?)');
      const insertText = db.prepare('INSERT INTO texts (lesson_id, type, content_jp, content_cn) VALUES (?, ?, ?, ?)');
      const insertArticle = db.prepare('INSERT INTO articles (lesson_id, title, content_jp, content_cn, source, tags) VALUES (?, ?, ?, ?, ?, ?)');

      // --- 开始执行 ---
      const bookResult = insertBook.run(bookData.title, bookData.description);
      const bookId = bookResult.lastInsertRowid as number;

      for (const lessonData of bookData.lessons) {
        const lessonResult = insertLesson.run(bookId, lessonData.lesson_number, lessonData.title);
        const lessonId = lessonResult.lastInsertRowid as number;

        // 处理词汇
        if (lessonData.vocabulary) {
          for (const vocab of lessonData.vocabulary) {
            let masterVocabId: number;
            const existingVocab = findMasterVocabulary.get<{ id: number }>(vocab.word);
            if (existingVocab) {
              masterVocabId = existingVocab.id;
            } else {
              const newVocabResult = insertMasterVocabulary.run(vocab.word, vocab.kana, vocab.meaning, vocab.part_of_speech, vocab.level || null);
              masterVocabId = newVocabResult.lastInsertRowid as number;
            }
            linkLessonVocabulary.run(lessonId, masterVocabId);
          }
        }

        // 处理语法 (新逻辑)
        if (lessonData.grammar) {
          for (const grammar of lessonData.grammar) {
            let masterGrammarId: number;
            const existingGrammar = findMasterGrammar.get<{ id: number }>(grammar.title);
            if (existingGrammar) {
              masterGrammarId = existingGrammar.id;
            } else {
              const newGrammarResult = insertMasterGrammar.run(grammar.title, grammar.explanation, grammar.level || null);
              masterGrammarId = newGrammarResult.lastInsertRowid as number;
            }
            linkLessonGrammar.run(lessonId, masterGrammarId);
            
            // 处理例句
            if (grammar.examples) {
              for (const example of grammar.examples) {
                insertSentence.run(null, masterGrammarId, example.jp, example.cn);
              }
            }
          }
        }

        // 处理课文
        if (lessonData.texts) {
          for (const text of lessonData.texts) {
            insertText.run(lessonId, text.type, text.content_jp, text.content_cn || null);
          }
        }

        // 处理文章
        if (lessonData.articles) {
          for (const article of lessonData.articles) {
            insertArticle.run(lessonId, article.title, article.content_jp, article.content_cn || null, article.source || null, (article.tags ? JSON.stringify(article.tags) : null));
          }
        }
      }
    });

    try {
      transaction();
      const message = `教材 "${bookData.title}" 导入成功！`;
      return { success: true, message };
    } catch (error) {
      console.error("Failed to import book:", error);
      dialog.showErrorBox('导入错误', `导入教材时发生错误: ${error.message}`);
      throw error;
    }
  });

  ipcMain.handle('db:markLessonAsComplete', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare(`
        INSERT INTO user_progress (entity_id, entity_type, status) 
        VALUES (?, 'lesson', 'completed')
        ON CONFLICT(entity_id, entity_type) DO UPDATE SET status = 'completed'
      `);
      stmt.run(lessonId);
      console.log(`[IPC] Lesson ${lessonId} marked as complete.`);
      return { success: true };
    } catch (error) {
      console.error(`[IPC ERROR] Failed to mark lesson ${lessonId} as complete:`, error);
      throw error;
    }
  });

  // 【新增】实现“标记为未完成”功能
  ipcMain.handle('db:unmarkLessonAsComplete', async (event, lessonId: number) => {
    try {
      // 从 user_progress 表中删除“已完成”的记录
      const stmt = db.prepare(`
        DELETE FROM user_progress 
        WHERE entity_id = ? AND entity_type = 'lesson' AND status = 'completed'
      `);
      const result = stmt.run(lessonId);
      
      // 同时，为了确保用户可以重新学习，我们将它标记为“已解锁”
      // 如果它已经是解锁状态，ON CONFLICT 会保证不会重复插入
      const unlockStmt = db.prepare(`
        INSERT INTO user_progress (entity_id, entity_type, status)
        VALUES (?, 'lesson', 'unlocked')
        ON CONFLICT(entity_id, entity_type) DO UPDATE SET status = 'unlocked'
      `);
      unlockStmt.run(lessonId);

      console.log(`[IPC] Lesson ${lessonId} unmarked as complete and set to unlocked. Rows affected: ${result.changes}`);
      return { success: true, rowsAffected: result.changes };
    } catch (error) {
      console.error(`[IPC ERROR] Failed to unmark lesson ${lessonId} as complete:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getCompletedLessons', async () => {
    try {
      const stmt = db.prepare("SELECT entity_id FROM user_progress WHERE entity_type = 'lesson' AND status = 'completed'");
      const rows = stmt.all() as { entity_id: number }[];
      return rows.map(row => row.entity_id);
    } catch (error) {
      console.error("[IPC ERROR] Failed to get completed lessons:", error);
      throw error;
    }
  });

  ipcMain.handle('db:unlockNextLesson', async (event, currentLessonId: number) => {
    try {
      const findLessonStmt = db.prepare('SELECT book_id, lesson_number FROM lessons WHERE id = ?');
      const currentLesson = findLessonStmt.get(currentLessonId) as any;
      if (!currentLesson) throw new Error(`Lesson with ID ${currentLessonId} not found.`);
      const findNextLessonStmt = db.prepare('SELECT id FROM lessons WHERE book_id = ? AND lesson_number = ?');
      const nextLesson = findNextLessonStmt.get(currentLesson.book_id, currentLesson.lesson_number + 1) as any;
      if (nextLesson) {
        const unlockStmt = db.prepare(`
          INSERT INTO user_progress (entity_id, entity_type, status) 
          VALUES (?, 'lesson', 'unlocked')
          ON CONFLICT(entity_id, entity_type) DO UPDATE SET status = 'unlocked' WHERE status != 'completed'
        `);
        unlockStmt.run(nextLesson.id);
        return { success: true, unlockedLessonId: nextLesson.id };
      }
      return { success: true, unlockedLessonId: null };
    } catch (error) {
      console.error(`[IPC ERROR] Failed to unlock next lesson after ${currentLessonId}:`, error);
      throw error;
    }
  });

  ipcMain.handle('db:getNeighborLessons', async (event, lessonId: number) => {
    try {
      const stmt = db.prepare(`
        WITH CurrentLesson AS (
          SELECT book_id, lesson_number FROM lessons WHERE id = ?
        )
        SELECT * FROM lessons
        WHERE book_id = (SELECT book_id FROM CurrentLesson)
        AND lesson_number IN (
          (SELECT lesson_number FROM CurrentLesson) - 1,
          (SELECT lesson_number FROM CurrentLesson),
          (SELECT lesson_number FROM CurrentLesson) + 1
        )
        ORDER BY lesson_number ASC
      `);
      const lessons = stmt.all(lessonId);
      return lessons;
    } catch (error) {
      console.error(`[IPC ERROR] Failed to get neighbor lessons for ID ${lessonId}:`, error);
      throw error;
    }
  });

  // 【修改】更新统计逻辑以使用 master_grammar 和 level 字段
  ipcMain.handle('db:getDashboardStats', async () => {
    try {
      const vocabStatsStmt = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN mastery_level = 2 THEN 1 ELSE 0 END) as mastered,
          SUM(CASE WHEN mastery_level = 1 THEN 1 ELSE 0 END) as familiar,
          SUM(CASE WHEN mastery_level = 0 THEN 1 ELSE 0 END) as unknown
        FROM master_vocabulary
      `);
      const vocabStats = vocabStatsStmt.get() as any;

      const grammarStatsStmt = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN mastery_level = 2 THEN 1 ELSE 0 END) as mastered,
          SUM(CASE WHEN mastery_level = 1 THEN 1 ELSE 0 END) as familiar,
          SUM(CASE WHEN mastery_level = 0 THEN 1 ELSE 0 END) as unknown
        FROM master_grammar
      `);
      const grammarStats = grammarStatsStmt.get() as any;

      const completedLessonsStmt = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE entity_type = 'lesson' AND status = 'completed'");
      const completedLessons = completedLessonsStmt.get() as any;

      // --- 为 JLPT 进度统计准备数据 ---
      const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
      const progressByLevel = {};

      const vocabByLevelStmt = db.prepare(`
        SELECT level, COUNT(*) as total, SUM(CASE WHEN mastery_level = 2 THEN 1 ELSE 0 END) as mastered
        FROM master_vocabulary
        WHERE level IS NOT NULL
        GROUP BY level
      `);
      const vocabByLevel = vocabByLevelStmt.all();

      const grammarByLevelStmt = db.prepare(`
        SELECT level, COUNT(*) as total, SUM(CASE WHEN mastery_level = 2 THEN 1 ELSE 0 END) as mastered
        FROM master_grammar
        WHERE level IS NOT NULL
        GROUP BY level
      `);
      const grammarByLevel = grammarByLevelStmt.all();

      for (const level of levels) {
        const vocabData = vocabByLevel.find(item => item.level === level) || { total: 0, mastered: 0 };
        const grammarData = grammarByLevel.find(item => item.level === level) || { total: 0, mastered: 0 };
        progressByLevel[level] = {
          mastered: (vocabData.mastered || 0) + (grammarData.mastered || 0),
          total: (vocabData.total || 0) + (grammarData.total || 0) || 1, // 避免除以 0
        };
      }

      return {
        vocabStats,
        grammarStats,
        completedLessons: completedLessons.count,
        progressByLevel,
      };
    } catch (error) {
      console.error("[IPC ERROR] Failed to get dashboard stats:", error);
      throw error;
    }
  });
}
