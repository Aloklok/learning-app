const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = path.join(__dirname, 'database.db');

// 准备工作: 删除旧的数据库文件以创建全新的数据库
if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
  console.log('Removed existing database file: database.db');
}

let db;
try {
  db = new Database(dbFile);
  console.log('Created new database file: database.db');

  // 1. books 表
  // 关联: books -> lessons
  db.exec(`
    CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT
    );
  `);
  console.log('Table "books" created.');

  // 2. lessons 表
  // 关联: lessons -> books (book_id)
  // 关联: lessons -> vocabulary (lesson_id)
  // 关联: lessons -> grammar (lesson_id)
  db.exec(`
    CREATE TABLE lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      lesson_number INTEGER NOT NULL,
      title TEXT NOT NULL,
      FOREIGN KEY (book_id) REFERENCES books(id)
    );
  `);
  console.log('Table "lessons" created.');

  // 3. vocabulary 表
  // 关联: vocabulary -> lessons (lesson_id)
  // 关联: vocabulary -> sentences (vocabulary_id)
  db.exec(`
    CREATE TABLE vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      word TEXT NOT NULL,
      kana TEXT,
      meaning TEXT,
      part_of_speech TEXT, -- 词性 (e.g., noun, verb, adjective)
      mastery_level INTEGER DEFAULT 0,
      last_reviewed_at DATETIME,
      next_review_at DATETIME,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    );
  `);
  console.log('Table "vocabulary" created.');

  // 4. grammar 表
  // 关联: grammar -> lessons (lesson_id)
  // 关联: grammar -> sentences (grammar_id)
  db.exec(`
    CREATE TABLE grammar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      explanation TEXT,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
    );
  `);
  console.log('Table "grammar" created.');

  // 5. sentences 表
  // 关联: sentences -> vocabulary (vocabulary_id)
  // 关联: sentences -> grammar (grammar_id)
  db.exec(`
    CREATE TABLE sentences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vocabulary_id INTEGER,
      grammar_id INTEGER,
      sentence_jp TEXT NOT NULL,
      sentence_cn TEXT,
      FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id),
      FOREIGN KEY (grammar_id) REFERENCES grammar(id)
    );
  `);
  console.log('Table "sentences" created.');

  // 6. user_progress 表
  // 关联: user_progress -> various entities (entity_id, entity_type)
  db.exec(`
    CREATE TABLE user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_id INTEGER NOT NULL,
      entity_type TEXT NOT NULL, -- e.g., 'vocabulary', 'lesson', 'grammar'
      status TEXT NOT NULL,      -- e.g., 'completed', 'in_progress', 'mastered'
      last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Table "user_progress" created.');

  console.log('Database schema initialization complete!');

} catch (err) {
  console.error('An error occurred during database schema initialization:', err.message);
} finally {
  if (db) {
    db.close();
    console.log('Database connection closed.');
  }
}
