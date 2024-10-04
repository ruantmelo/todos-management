import './env'

import fastify, { FastifyBaseLogger, FastifyHttpOptions } from 'fastify'
import { type Server } from 'node:http'
import {  createJsonSchemaTransformObject, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";

import { drizzlePlugin } from './database/drizzle-plugin'
import { todosRoutes } from './routes/todo'
import { categoriesRoutes } from './routes/categories'

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { CategorySchema } from './models/categories';
import { TodoSchema } from './models/todos';

export type FastifyAppOptions = FastifyHttpOptions<Server, FastifyBaseLogger> & {
  generateDocs?: boolean;
}

export function buildApp(opts?: FastifyAppOptions ) {

  const app = fastify(opts)
                .setValidatorCompiler(validatorCompiler)
                .setSerializerCompiler(serializerCompiler)
                .withTypeProvider<ZodTypeProvider>()



  if (opts?.generateDocs) {
     app.register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Todo Management', 
          version: '0.1.0'
        },
      },
      transform: jsonSchemaTransform,
      transformObject: createJsonSchemaTransformObject({
        schemas: {
          Category: CategorySchema,
          Todo: TodoSchema
        }
      })
    })
  
    app.register(fastifySwaggerUI, {
      routePrefix: '/documentation'
    })
  }

  app.register(drizzlePlugin)

  app.register((instance, opts, done) => {
    app.register(todosRoutes, { prefix: '/todos' });
    app.register(categoriesRoutes, { prefix: 'categories' })
    done()
  }, { prefix: '/v1' })

  return app;
}