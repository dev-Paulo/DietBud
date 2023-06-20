import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { dietBudRoutes } from './routes/dietBud'

export const app = fastify()

app.register(cookie)

app.register(dietBudRoutes, {
  prefix: 'dietBud',
})
