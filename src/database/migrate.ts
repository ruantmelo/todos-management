import 'dotenv/config';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { getDatabase, closeConnection } from './index';
import path from 'path'

async function runMigrations(){
  const migrationsFolder =  path.join(__dirname, '..', '..', 'drizzle')

  migrate(getDatabase(), { migrationsFolder })

  closeConnection();
}

runMigrations()