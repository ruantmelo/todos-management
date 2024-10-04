import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema'
import Database, { Database as BetterSqlite3Database } from 'better-sqlite3';
import { envVariables } from '../env';

export let dbConnection: BetterSqlite3Database = new Database(envVariables.DATABASE_URL)
export let db: Database | null = getDatabase()

export function getDatabase() {
  if (!dbConnection.open) dbConnection = new Database(envVariables.DATABASE_URL);

  let newDb = drizzle(dbConnection, {
    schema
  })

  db = newDb
  
  return db;
}

export function closeConnection(){
  dbConnection.close()
  db = null;
}


export type Database = BetterSQLite3Database<typeof schema>