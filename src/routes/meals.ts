/* eslint-disable camelcase */
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function Meals(app: FastifyInstance) {
  // create meals
  app.post('/:id/create', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const createUserMealsBodySchema = z.object({
      meal_name: z.string().nonempty('A name for this meal is required'),
      meal_description: z
        .string()
        .nonempty('A description for this meal is required'),
      date: z.string().nonempty('A date for this meal is required'),
      inside_diet: z.boolean().default(true),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const { meal_name, meal_description, date, inside_diet } =
      createUserMealsBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    // const user = await knex('users')
    //   .where({
    //     session_id: sessionId,
    //     id,
    //   })
    //   .first()

    await knex('meals').insert({
      meal_id: randomUUID(),
      user_id: id,
      meal_name,
      meal_description,
      date,
      inside_diet,
    })

    return reply.status(201).send()
  })

  // get meals from a user

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)
    // const { sessionId } = request.cookies

    const meals = await knex('meals').where({
      user_id: id,
    })

    return { meals }
  })
}
