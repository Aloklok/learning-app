// electron/lib/migrator.ts
import type { Database } from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export function runMigrations(db: Database, migrationsPath: string) {
  console.log('[Migrator] Starting database migration process...');

  // 步骤 1: 确保 meta 表存在
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
  } catch (error) {
    console.error('[Migrator] Failed to create meta table:', error);
    throw error;
  }

  // 步骤 2: 获取当前数据库版本
  let currentVersion = 0;
  try {
    const stmt = db.prepare("SELECT value FROM meta WHERE key = 'user_version'");
    const row: { value: string } | undefined = stmt.get() as any;
    if (row) {
      currentVersion = parseInt(row.value, 10);
    } else {
      // 如果版本不存在，则插入初始版本 0
      db.prepare("INSERT INTO meta (key, value) VALUES ('user_version', '0')").run();
    }
  } catch (error) {
    console.error('[Migrator] Failed to get current database version:', error);
    throw error;
  }

  console.log(`[Migrator] Current database version: ${currentVersion}`);

  // 步骤 3: 读取所有迁移文件
  let migrationFiles: string[];
  try {
    migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();
  } catch (error) {
    console.error(`[Migrator] Failed to read migrations directory at ${migrationsPath}:`, error);
    throw error;
  }

  // 步骤 4: 应用所有新的迁移
  const transaction = db.transaction(() => {
    for (const file of migrationFiles) {
      const fileVersion = parseInt(file.split('_')[0], 10);
      if (fileVersion > currentVersion) {
        console.log(`[Migrator] Applying migration: ${file}...`);
        try {
          const sql = fs.readFileSync(path.join(migrationsPath, file), 'utf8');
          db.exec(sql);
          
          // 更新数据库版本号
          const updateStmt = db.prepare("UPDATE meta SET value = ? WHERE key = 'user_version'");
          updateStmt.run(fileVersion.toString());

          console.log(`[Migrator] Successfully applied ${file} and updated version to ${fileVersion}.`);
        } catch (error) {
          console.error(`[Migrator] Failed to apply migration ${file}:`, error);
          // 事务将自动回滚
          throw new Error(`Migration failed at ${file}: ${(error as Error).message}`);
        }
      }
    }
  });

  try {
    transaction();
    console.log('[Migrator] All new migrations applied successfully.');
  } catch (error) {
    console.error('[Migrator] Migration transaction failed. Database has been rolled back.');
    // 重新抛出错误，以便主进程可以捕获它
    throw error;
  }
}
