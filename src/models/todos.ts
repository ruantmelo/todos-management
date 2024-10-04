import { todos } from "../database/schema";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export type Todo = typeof todos.$inferSelect

export const TodoSchema = createSelectSchema(todos)
export const CreateTodoSchema = createInsertSchema(todos)