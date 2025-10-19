import { Hono } from 'hono'
import APIError from '../libs/APIError'
import type { Bindings, Variables } from '../@types'

const sessionsRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>()

sessionsRouter.get('/sessions/:code', async (c) => {
  const { code } = c.req.param()
  // const prisma = c.get('prisma')

  // const session = await prisma.event.findUnique({
  //   where: { code }
  // })
  // if (!session) {
  //   throw new APIError('not-found', 'session-not-found', 'Session not found')
  // }

  if (code !== 'TESTCODE') {
    c.status(404)
    throw new APIError('not-found', 'session-not-found', 'session not found')
  }

  return c.json({ name: `Session ${code}` })
})

export default sessionsRouter
