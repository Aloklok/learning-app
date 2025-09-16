-- 0001_add_levels_and_master_grammar.sql

-- 步骤 1: 为 master_vocabulary 表添加 level 字段，用于 JLPT 等级统计
ALTER TABLE master_vocabulary ADD COLUMN level TEXT;

-- 步骤 2: 将旧的 grammar 表重命名，作为备份 (安全操作)
ALTER TABLE grammar RENAME TO grammar_old;

-- 步骤 3: 创建新的 master_grammar 中央语法库表
CREATE TABLE master_grammar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  explanation TEXT,
  level TEXT, -- 新增 level 字段
  mastery_level INTEGER DEFAULT 0,
  last_reviewed_at DATETIME,
  next_review_at DATETIME
);

-- 步骤 4: 创建语法点与课程的关联表
CREATE TABLE lesson_grammar_link (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  master_grammar_id INTEGER NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id),
  FOREIGN KEY (master_grammar_id) REFERENCES master_grammar(id),
  UNIQUE (lesson_id, master_grammar_id)
);

-- 步骤 5: (可选) 从旧表中迁移数据到新表结构
-- 注意: 这部分依赖于旧数据的结构，这里提供一个通用模板。
-- 您可能需要根据实际情况调整。
INSERT INTO master_grammar (title, explanation, mastery_level, last_reviewed_at, next_review_at)
SELECT DISTINCT title, explanation, mastery_level, last_reviewed_at, next_review_at FROM grammar_old;

INSERT INTO lesson_grammar_link (lesson_id, master_grammar_id)
SELECT g_old.lesson_id, mg.id
FROM grammar_old AS g_old
JOIN master_grammar AS mg ON g_old.title = mg.title;

-- 步骤 6: (可选) 删除旧的备份表
-- 建议在确认数据迁移无误后再手动执行
-- DROP TABLE grammar_old;

-- 步骤 7: 更新 sentences 表的外键，使其关联到新的 master_grammar 表
-- 由于 SQLite 的限制，直接修改外键比较复杂。
-- 通常采用“创建新表 -> 迁移数据 -> 删除旧表 -> 重命名新表”的方式。

CREATE TABLE sentences_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vocabulary_id INTEGER,
  grammar_id INTEGER, -- 将关联到 master_grammar
  sentence_jp TEXT NOT NULL,
  sentence_cn TEXT,
  FOREIGN KEY (vocabulary_id) REFERENCES master_vocabulary(id),
  FOREIGN KEY (grammar_id) REFERENCES master_grammar(id) -- 外键更新
);

INSERT INTO sentences_new (id, vocabulary_id, grammar_id, sentence_jp, sentence_cn)
SELECT 
    s.id, 
    s.vocabulary_id, 
    mg.id, -- 通过 title 关联找到新的 master_grammar_id
    s.sentence_jp, 
    s.sentence_cn
FROM sentences s
LEFT JOIN grammar_old go ON s.grammar_id = go.id
LEFT JOIN master_grammar mg ON go.title = mg.title;

DROP TABLE sentences;
ALTER TABLE sentences_new RENAME TO sentences;

