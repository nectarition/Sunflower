import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import errorHandler from './middlewares/errorHandler'
import mailer from './middlewares/mailer'
import prisma from './middlewares/prisma'
import requiredLogin from './middlewares/requiredLogin'
import accountsRouter from './routes/accountsRouter'
import circlesRouter from './routes/circlesRouter'
import eventsRouter from './routes/eventsRouter'
import type { APIContext, Bindings, Variables } from './@types'

const app = new Hono<{ Bindings: Bindings, Variables: Variables }>()
app.onError(errorHandler)

const getAllowedOrigins = (c: APIContext): string[] => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS
  if (!allowedOrigins) {
    throw new Error('ALLOWED_ORIGINS not configured')
  }

  return allowedOrigins.split(',').map((origin: string) => origin.trim())
}

app.use('*', (c, next) => {
  const allowedOrigins = getAllowedOrigins(c)
  return cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-JSON-Response-Count'],
    maxAge: 600
  })(c, next)
})
app.use('*', prisma)
app.use('*', mailer)

app.get('/', (c) => {
  return c.text('Hello world!')
})

app.get('/test', requiredLogin, async (c) => {
  return c.json(c.get('user'))
})

app.route('/', accountsRouter)
app.route('/', eventsRouter)
app.route('/', circlesRouter)

export default app
