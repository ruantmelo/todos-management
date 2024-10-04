import 'dotenv/config';
import { getDatabase } from ".";
import { categories as CategoriesSchema, todos as TodosSchema } from "./schema";
import { CreateCategorySchema } from '../models/categories';
import { CreateTodoSchema } from '../models/todos';
import { z } from 'zod';

export const categories: z.infer<typeof CreateCategorySchema>[] = [
  { id: 1, name: 'Study' },
  { id: 2, name: 'Work'},
  { id: 3, name: 'Personal'}
];

export const todos: z.infer<typeof CreateTodoSchema>[] = [
  {
    id: 1,
    title: 'Compilers Project',
    categoryId: 1,
    description: null
  },
  {
    id: 2,
    title: 'Jira Tasks',
    categoryId: 2,
    description: null
  },
  {
    id: 3,
    title: 'Gym',
    categoryId: 3,
    description: null
  }
]

async function seedDatabase(){

  const db = getDatabase()

  db.delete(TodosSchema).run()
  db.delete(CategoriesSchema).run()
  
  await db.insert(CategoriesSchema).values(categories)

  await db.insert(TodosSchema).values(todos)
}
  
seedDatabase()