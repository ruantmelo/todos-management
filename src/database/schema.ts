import { relations } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  categoryId: integer('category_id').notNull().references(() => categories.id)
})

export const todosRelations = relations(todos, ({ one }) => ({
  category: one(categories, {
    fields: [todos.categoryId],
    references: [categories.id]
  }),  
}));


export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  todos: many(todos)
}))

