import fastify, { FastifyBaseLogger } from 'fastify'
import { type Database } from './src/database'
import { App } from './src/app'
import { IncomingMessage, ServerResponse } from 'http'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

declare module 'fastify' {
  // interface FastifyRequest {
  //   db: string
  // }
  // interface FastifyReply {
  //   db: number
  // }

  export type FastifyZodInstance = FastifyInstance<Server<typeof IncomingMessage, typeof ServerResponse>, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, ZodTypeProvider>;

  interface FastifyInstance extends FastifyZodInstance {
    db: Database
  }

  
}