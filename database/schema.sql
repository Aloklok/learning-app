-- database/schema.sql (Final Version)

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT
);

CREATE TABLE lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER NOT NULL,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE master_vocabulary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL UNIQUE,
  kana TEXT,
  meaning TEXT,
  part_of_speech TEXT,
  mastery_level INTEGER DEFAULT 0,
  last_reviewed_at DATETIME,
  next_review_at DATETIME
);

CREATE TABLE lesson_vocabulary_link (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  master_vocabulary_id INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (master_vocabulary_id) REFERENCES master_vocabulary(id),
  UNIQUE (lesson_id, master_vocabulary_id)
);

-- --- 核心修改点 ---
-- 为 grammar 表添加记忆曲线所需字段
CREATE TABLE grammar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT,
  mastery_level INTEGER DEFAULT 0,
  last_reviewed_at DATETIME,
  next_review_at DATETIME,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE sentences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vocabulary_id INTEGER,
  grammar_id INTEGER,
  sentence_jp TEXT NOT NULL,
  sentence_cn TEXT,
  FOREIGN KEY (vocabulary_id) REFERENCES master_vocabulary(id),
  FOREIGN KEY (grammar_id) REFERENCES grammar(id)
);

CREATE TABLE texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  content_jp TEXT NOT NULL,
  content_cn TEXT,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER,
  title TEXT NOT NULL,
  content_jp TEXT NOT NULL,
  content_cn TEXT,
  source TEXT,
  tags TEXT,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

-- 在 database/schema.sql 文件末尾添加
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id INTEGER NOT NULL,
  entity_type TEXT NOT NULL,
  status TEXT NOT NULL,
  UNIQUE (entity_id, entity_type)
);
