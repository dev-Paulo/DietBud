import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { Users } from './routes/users'
import { Meals } from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(Users, {
  prefix: 'users',
})
app.register(Meals, {
  prefix: 'meals',
})
