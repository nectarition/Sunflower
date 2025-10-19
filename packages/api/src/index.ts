import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import errorHandler from './middlewares/errorHandler'
import mailer from './middlewares/mailer'
import prisma from './middlewares/prisma'
import requiredLogin from './middlewares/requiredLogin'
import accountsRouter from './routes/accountsRouter'
import sessionsRouter from './routes/sessionsRouter'
import type { Bindings, Variables } from './@types'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
app.onError(errorHandler)
app.use('*', cors())
app.use('*', prisma)
app.use('*', mailer)

app.get('/', (c) => {
  return c.text('Hello world!')
})

app.get('/test', requiredLogin, async (c) => {
  return c.json(c.get('user'))
})

app.route('/', accountsRouter)
app.route('/', sessionsRouter)

export default app
