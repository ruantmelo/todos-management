import { buildApp } from "../app"
import { test, before, after } from 'tap'
import { categories } from "../database/seed"
import { z } from "zod"
import { Category, CategorySchema, CreateCategorySchema } from "../models/categories"
import { FastifyZodInstance } from "fastify"

let createdCategory: null | Category = null;
let app: FastifyZodInstance;  

before(() => {
  app = buildApp()
})

after(async () => {
  await app.close()
})

test('It should be able to list all categories', async t => {

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

  const { statusCode } = await app.inject({
    url: `/v1/categories/${createdCategory.id}`,
    method: 'DELETE',
  })

  t.equal(statusCode, 204, 'return a status code of 204')
})