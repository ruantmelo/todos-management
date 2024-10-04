import { defineConfig } from 'drizzle-kit';
import { envVariables } from './src/env';

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './drizzle',
  dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: envVariables.DATABASE_URL
  },
});