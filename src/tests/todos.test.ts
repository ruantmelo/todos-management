import { buildApp } from "../app"
import { test, before, after } from 'tap'
import { todos } from "../database/seed"
import { CreateTodoSchema, Todo, TodoSchema } from "../models/todos"
import { z } from "zod"
import { FastifyZodInstance } from "fastify"

let createdTodo: null | Todo = null;
let app: FastifyZodInstance;  


before(() => {
  app = buildApp()
})

after(async () => {
  await app.close()
})

test('It should be able to list all todos', async t => {
  
  const { statusCode, body } = await app.inject({
    url: '/v1/todos',
    method: 'GET'
  })

  t.equal(statusCode, 200, 'return a status code of 200')

  const data = JSON.parse(body)

  t.type(data, Array, 'return a list of items')

  t.matchOnly(data[0], todos[0], 'matchOnlyStrict properties are correct') // Não converte para comparar
})

test('It should be able to create a todo', async t => {

  const newTodo: z.infer<typeof CreateTodoSchema> = {
    title: 'Math exercises',
    categoryId: 1,
    description: 'Practice Calculus 1 exercises for the exam'
  } 
  

  const { statusCode, body} = await app.inject({
    url: '/v1/todos',
    method: 'POST',
    body: newTodo,
  })

  const data = JSON.parse(body)

  t.equal(statusCode, 201, 'return a status code of 201')
  t.matchStrict(data, newTodo);
  t.ok(TodoSchema.safeParse(data).success, 'match todo schema')

  createdTodo = data as Todo;
})

test('It should be able to delete a todo', async t => {
  if (!createdTodo) return t.fail('todo not created (parent)')

  const { statusCode } = await app.inject({
    url: `/v1/todos/${createdTodo.id}`,
    method: 'DELETE',
  })

  t.equal(statusCode, 204, 'return a status code of 204');
})