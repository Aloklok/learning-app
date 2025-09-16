const path = require('path');
const Database = require('better-sqlite3');

const dbFile = path.join(__dirname, 'database.db');

let db;
try {
  db = new Database(dbFile);
  console.log('Connected to database: database.db');

  // Add last_reviewed_at column
  try {
    db.exec(`
      ALTER TABLE vocabulary
      ADD COLUMN last_reviewed_at DATETIME;
    `);
    console.log('Column "last_reviewed_at" added to "vocabulary" table successfully.');
  } catch (err) {
    if (err.message.includes('duplicate column name: last_reviewed_at')) {
      console.warn('Column "last_reviewed_at" already exists. Skipping.');
    } else {
      throw err; // Re-throw other errors
    }
  }

  // Add next_review_at column
  try {
    db.exec(`
      ALTER TABLE vocabulary
      ADD COLUMN next_review_at DATETIME;
    `);
    console.log('Column "next_review_at" added to "vocabulary" table successfully.');
  } catch (err) {
    if (err.message.includes('duplicate column name: next_review_at')) {
      console.warn('Column "next_review_at" already exists. Skipping.');
    } else {
      throw err; // Re-throw other errors
    }
  }

  console.log('Database migration v2 complete!');

} catch (err) {
  console.error('An error occurred during database migration:', err.message);
} finally {
  if (db) {
    db.close();
    console.log('Database connection closed.');
  }
}
