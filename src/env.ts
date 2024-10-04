import 'dotenv/config'
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string()
})



export const envVariables = envSchema.parse(process.env)