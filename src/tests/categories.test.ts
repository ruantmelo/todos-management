import { buildApp } from "../app"
import { test } from 'tap'
import { categories } from "../database/seed"
import { z } from "zod"
import { Category, CategorySchema, CreateCategorySchema } from "../models/categories"

let createdCategory: null | Category = null;

test('It should be able to list all categories', async t => {
  const app = buildApp()

  t.teardown(async () => await app.close())

  const { statusCode, body } = await app.inject({
    url: '/v1/categories',
    method: 'GET'
  })

  t.equal(statusCode, 200, 'return a status code of 200')

  const data = JSON.parse(body)

  t.type(data, Array, 'return a list of items')

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    t.matchOnly(element, categories[index], 'properties are correct');
  }
  
})

test('It should be able to create a category', async t => {
  const app = buildApp()

  t.teardown(async () => await app.close())

  const newCategory: z.infer<typeof CreateCategorySchema> = {
    name: 'Workout',
  } 

  const { statusCode, body } = await app.inject({
    url: '/v1/categories',
    method: 'POST',
    body: newCategory
  })

  const data = JSON.parse(body)
  t.equal(statusCode, 201, 'return a status code of 201');
  t.matchStrict(data, newCategory)
  t.ok(CategorySchema.safeParse(data).success, 'match category schema')

  createdCategory = data as Category;
})


test('It should be able to delete a category', async t => {
  if (!createdCategory) return t.fail('category not created (parent)');

  const app = buildApp()

  t.teardown(async () => await app.close())

  const { statusCode } = await app.inject({
    url: `/v1/categories/${createdCategory.id}`,
    method: 'DELETE',
  })

  t.equal(statusCode, 204, 'return a status code of 204')
})