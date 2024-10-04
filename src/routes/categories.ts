import { CreateCategorySchema } from "../models/categories";
import { categories } from "../database/schema";
import { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const categoriesRoutes: FastifyPluginCallbackZod = (instance, opts, done) => {
  instance.get('/', async () => {
    const categories = await instance.db.query.categories.findMany();

    return categories;
  })

  instance.post('/', {
    schema: {
      body: CreateCategorySchema
    }
  }, async (req, reply) => {
    reply.statusCode = 201;
    
    const result = await instance.db.insert(categories).values(req.body).returning()

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

    await instance.db.delete(categories).where(eq(categories.id, req.params.id))
    reply.send()

    return reply;
  })

  done()
}