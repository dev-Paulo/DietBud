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

  // get all meals
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const meals = await knex('meals').select('*')

    return { meals }
  })

  // get meals from a user

  app.get(
    '/user/:id',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)
      // const { sessionId } = request.cookies

      const meals = await knex('meals').where({
        user_id: id,
      })

      return { meals }
    },
  )
  // get an specific meal
  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)
    // const { sessionId } = request.cookies

    const meals = await knex('meals').where({
      meal_id: id,
    })

    return { meals }
  })

  // get a summary of meals
  app.get(
    '/summary/:userID',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const getMealsSummarySchema = z.object({
        userID: z.string().uuid(),
      })

      const { userID } = getMealsSummarySchema.parse(request.params)

      const { sessionId } = request.cookies

      const [user] = await knex('users')
        .where('id', userID)
        .andWhere('session_id', sessionId)
        .select('id')

      const userId = user.id

      //   const [count] = await knex('meals')
      //     .count('*', {
      //       as: 'Total of meals registered',
      //     })
      //     .where('user_id', userId)

      const meals = await knex('meals').where('user_id', userId)
      const mealsInsideDiet = meals.filter((meal) => meal.inside_diet)
      const mealsOutsideDiet = meals.filter((meal) => !meal.inside_diet)

      const mealsBestSequence = meals.reduce(
        (count, meal) => {
          if (meal.inside_diet) {
            count.sequence++
          }
          if (!meal.inside_diet) {
            if (count.sequence > count.total) {
              count.total = count.sequence
            }
            count.sequence = 0
          }

          return count
        },
        {
          total: 0,
          sequence: 0,
        },
      )

      //   const count = await knex('meals')
      //     .count('meal_id', { as: 'Total de refeições registradas' })
      //     .where('user_id', userId)
      //     .first()

      //   const totalMealsInsideDiet = await knex('meals')
      //     .count('meal_id', { as: 'Total de refeições dentro da dieta' })
      //     .where('inside_diet', true)
      //     .andWhere('user_id', userId)

      //   const totalMealsOutsideDiet = await knex('meals')
      //     .count('meal_id', { as: 'Total de refeições fora da dieta' })
      //     .where('inside_diet', false)
      //     .andWhere('user_id', userId)

      //   const summary = {
      //     'Total de refeições registradas': parseInt(
      //       JSON.parse(JSON.stringify(count))['Total de refeições registradas'],
      //     ),

      //     'Total de refeições dentro da dieta': parseInt(
      //       JSON.parse(JSON.stringify(totalMealsInsideDiet))[0][
      //         'Total de refeições dentro da dieta'
      //       ],
      //     ),

      //     'Total de refeições fora da dieta': parseInt(
      //       JSON.parse(JSON.stringify(totalMealsOutsideDiet))[0][
      //         'Total de refeições fora da dieta'
      //       ],
      //     ),

      //     'Streak de refeições dentro da dieta': parseInt(
      //       JSON.parse(JSON.stringify(mealsBestSequence.sequence))[0][
      //         'Streak de refeições dentro da dieta'
      //       ],
      //     ),
      //   }

      //   return { summary }

      return {
        total: meals.length,
        totalInsideInDiet: mealsInsideDiet.length,
        totalOutsideDiet: mealsOutsideDiet.length,
        bestInsideDietSequence:
          mealsBestSequence.sequence > mealsBestSequence.total
            ? mealsBestSequence.sequence
            : mealsBestSequence.total,
      }
    },
  )

  // update a meal
  app.put(
    '/:userID/:mealID',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const getMealParamsSchema = z.object({
        userID: z.string().uuid(),
        mealID: z.string().uuid(),
      })

      const { userID, mealID } = getMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const [user] = await knex('users')
        .where('id', userID)
        .andWhere('session_id', sessionId)
        .select('id')

      const userId = user.id

      const editMealBodySchema = z.object({
        meal_name: z.string(),
        meal_description: z.string(),
        inside_diet: z.boolean(),
      })

      const { meal_name, meal_description, inside_diet } =
        editMealBodySchema.parse(request.body)

      const meal = await knex('meals')
        .andWhere('user_id', userId)
        .andWhere('meal_id', mealID)
        .update({
          meal_name,
          meal_description,
          inside_diet,
        })

      if (!meal) {
        return response.status(401).send({
          error: 'No meal was found',
        })
      }

      return response.status(201).send('Meal updated')
    },
  )

  // delete a meal
  app.delete(
    '/:userID/:mealID',
    { preHandler: [checkSessionIdExists] },
    async (request, response) => {
      const getMealParamsSchema = z.object({
        userID: z.string().uuid(),
        mealID: z.string().uuid(),
      })

      const { userID, mealID } = getMealParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const [user] = await knex('users')
        .where('id', userID)
        .andWhere('session_id', sessionId)
        .select('id')

      const userId = user.id

      const meal = await knex('meals')
        .where('meal_id', mealID)
        .andWhere('user_id', userId)
        .first()
        .delete()

      if (!meal) {
        return response.status(401).send({
          error: 'No meal was found',
        })
      }

      return response.status(202).send('Meal deleted')
    },
  )
}
