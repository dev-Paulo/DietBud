import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function dietBudRoutes(app: FastifyInstance) {
  app.get(
    '/users',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const users = await knex('users').where('session_id', sessionId).select()

      return users
    },
  )

  app.post('/users/create', async (request, reply) => {
    const createUserSignUpBodySchema = z.object({
      name: z.string().nonempty('User name is required'),
      email: z.string().nonempty('User email is required'),
    })

    const { name, email } = createUserSignUpBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
