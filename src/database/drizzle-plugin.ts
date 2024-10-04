import { type FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { closeConnection, getDatabase } from '.';

export const drizzlePlugin: FastifyPluginAsync =  fp(async (fastify) => {
  
  if (fastify.db) return;
  
  fastify.decorate('db', getDatabase())

  fastify.addHook('onClose', (fastify) => {
    if (fastify.db) {
      closeConnection();
    };    
  })
})