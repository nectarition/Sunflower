import { Hono } from 'hono'
import { $Enums } from '../generated/prisma'
import APIError from '../libs/APIError'
import requiredLogin from '../middlewares/requiredLogin'
import eventService from '../services/eventService'
import type { Bindings, Variables } from '../@types'

const circlesRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>()

circlesRouter.get('/circles/:eventCode/:circleCode', requiredLogin, async (c) => {
  const { eventCode, circleCode } = c.req.param()
  const prisma = c.get('prisma')

  const event = await eventService.getEventByCodeAsync(c, eventCode)
  if (!event) {
    throw new APIError('not-found', 'event-not-found', 'Event not found')
  }

  const circle = await prisma.circle.findUnique({
    where: { code: circleCode }
  })
  if (!circle) {
    throw new APIError('not-found', 'circle-not-found', 'Circle not found')
  }
  return c.json(circle)
})

circlesRouter.post('/circles/:eventCode/:circleCode/status', requiredLogin, async (c) => {
  const { eventCode, circleCode } = c.req.param()
  const prisma = c.get('prisma')

  const event = await eventService.getEventByCodeAsync(c, eventCode)
  if (!event) {
    throw new APIError('not-found', 'event-not-found', 'Event not found')
  }

  const circle = await prisma.circle.findUnique({
    where: { code: circleCode }
  })
  if (!circle) {
    throw new APIError('not-found', 'circle-not-found', 'Circle not found')
  }

  const { status } = await c.req.json() as { status: number }

  const dbStatus: $Enums.CircleStatusTypes =
    status === 1
      ? 'Attend'
      : status === 2
        ? 'Absent'
        : 'None'

  await prisma.circle.update({
    where: { code: circleCode },
    data: {
      status: dbStatus,
      updatedAt: new Date()
    }
  })

  return c.json({ success: true })
})

export default circlesRouter
