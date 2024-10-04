import './env'

import fastify, { FastifyBaseLogger, FastifyHttpOptions } from 'fastify'
import { type Server } from 'node:http'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod"

import { drizzlePlugin } from './database/drizzle-plugin'
import { todosRoutes } from './routes/todo'
import { categoriesRoutes } from './routes/categories'

export function buildApp(opts?: FastifyHttpOptions<Server, FastifyBaseLogger> ) {

  const app = fastify(opts)
                .setValidatorCompiler(validatorCompiler)
                .setSerializerCompiler(serializerCompiler)
                .withTypeProvider<ZodTypeProvider>()

  app.register(drizzlePlugin)

  app.register((instance, opts, done) => {
    app.register(todosRoutes, { prefix: '/todos' });
    app.register(categoriesRoutes, { prefix: 'categories' })
    done()
  }, { prefix: '/v1' })

  return app;
}