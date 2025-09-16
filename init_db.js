const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbFile = path.join(__dirname, 'database.db');

// 1. 检查数据库文件是否存在
if (fs.existsSync(dbFile)) {
  console.log('Database file "database.db" already exists. Initialization skipped.');
  process.exit(0);
}

// 2. 如果不存在，则创建并初始化
let db;
try {
  db = new Database(dbFile);
  console.log('Created new database file: database.db');

  const createTableSql = `
    CREATE TABLE vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      kana TEXT,
      meaning TEXT
    );
  `;
  
  db.exec(createTableSql);
  console.log('Table "vocabulary" created successfully.');

  // 3. 插入测试数据
  const words = [
    { word: 'こんにちは', kana: 'こんにちは', meaning: '你好' },
    { word: 'ありがとう', kana: 'ありがとう', meaning: '谢谢' },
    { word: 'すみません', kana: 'すみません', meaning: '对不起/打扰一下' }
  ];

  const insert = db.prepare('INSERT INTO vocabulary (word, kana, meaning) VALUES (@word, @kana, @meaning)');

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item);
    }
  });

  insertMany(words);
  console.log('Inserted 3 sample Japanese words into the vocabulary table.');

  console.log('Database initialization complete!');

} catch (err) {
  console.error('An error occurred during database initialization:', err.message);
} finally {
  if (db) {
    db.close();
    console.log('Database connection closed.');
  }
}
