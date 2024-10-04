import { FastifyPluginCallback } from "fastify"
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { CreateTodoSchema } from "../models/todos";
import { todos } from "../database/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const todosRoutes: FastifyPluginCallbackZod = (instance, opts, done) => {
  instance.get('/', async () => {
    const data = await instance.db.query.todos.findMany();

    return data;
  })

  instance.post('/', {
    schema: {
      body: CreateTodoSchema
    }
  }, async (req, reply) => {
    reply.statusCode = 201;
    
    const result = await instance.db.insert(todos).values(req.body).returning();

    return result[0];

  })

  instance.delete('/:id', {
    schema: {
      params: z.object({
        id: z.coerce.number(),
      })
    }
  }, async (req, reply) => {
    reply.statusCode = 204;

    await instance.db.delete(todos).where(eq(todos.id, req.params.id))
    reply.send()

    return reply;
  })

  done()
}