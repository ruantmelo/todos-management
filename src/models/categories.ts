import { categories } from "../database/schema";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type Category = typeof categories.$inferSelect

export const CategorySchema = createSelectSchema(categories)
export const CreateCategorySchema = createInsertSchema(categories)