const path = require('path');
const Database = require('better-sqlite3');

const dbFile = path.join(__dirname, 'database.db');

let db;
try {
  db = new Database(dbFile);
  console.log('Connected to database: database.db');

  const alterTableSql = `
    ALTER TABLE vocabulary
    ADD COLUMN mastery_level INTEGER DEFAULT 0;
  `;
  
  db.exec(alterTableSql);
  console.log('Column "mastery_level" added to "vocabulary" table successfully.');

  console.log('Database migration v1 complete!');

} catch (err) {
  if (err.message.includes('duplicate column name: mastery_level')) {
    console.warn('Column "mastery_level" already exists. Migration skipped.');
  } else {
    console.error('An error occurred during database migration:', err.message);
  }
} finally {
  if (db) {
    db.close();
    console.log('Database connection closed.');
  }
}
