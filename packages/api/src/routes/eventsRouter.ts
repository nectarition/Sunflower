import { Hono } from 'hono'
import APIError from '../libs/APIError'
import requiredLogin from '../middlewares/requiredLogin'
import eventService from '../services/eventService'
import type { Bindings, Variables } from '../@types'
import type { SoleilCircle, SoleilCircleAppModel, SoleilEvent } from 'soleil'

const eventsRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>()

eventsRouter.get('/events', requiredLogin, async (c) => {
  const prisma = c.get('prisma')
  const user = c.get('user')

  const events = await prisma.event.findMany({
    where: {
      organization: {
        organizationUsers: {
          some: {
            userId: user.id
          }
        }
      }
    },
    select: {
      code: true,
      name: true,
      organization: true,
      date: true
    },
    orderBy: {
      date: 'asc'
    }
  })
  const mappedEvents: SoleilEvent[] = events.map(event => ({
    code: event.code,
    name: event.name,
    organization: {
      name: event.organization.name
    },
    date: event.date
  }))
  return c.json(mappedEvents)
})

eventsRouter.get('/events/:code', requiredLogin, async (c) => {
  const { code } = c.req.param()

  const event = await eventService.getEventByCodeAsync(c, code)
  if (!event) {
    throw new APIError('not-found', 'event-not-found', 'Event not found')
  }
  const mappedEvent: SoleilEvent = {
    code: event.code,
    name: event.name,
    organization: {
      name: event.organization.name
    },
    date: event.date
  }
  return c.json(mappedEvent)
})

eventsRouter.post('/events/:code/circles', requiredLogin, async (c) => {
  const { code } = c.req.param()
  const prisma = c.get('prisma')

  const event = await eventService.getEventByCodeAsync(c, code)
  if (!event) {
    throw new APIError('not-found', 'event-not-found', 'Event not found')
  }

  await prisma.circle.deleteMany({
    where: { eventId: event.id }
  })
  
  const circles = await c.req.json() as Record<string, SoleilCircle>
  const createData = Object.entries(circles)
    .map(([circleCode, circle]) => ({
      eventId: event.id,
      code: circleCode,
      name: circle.name,
      spaceNumber: circle.spaceNumber
    }))

  await prisma.circle.createMany({
    data: createData
  })
  
  return c.json({ success: true })
})

eventsRouter.get('/events/:code/circles', requiredLogin, async (c) => {
  const { code } = c.req.param()
  const prisma = c.get('prisma')

  const event = await eventService.getEventByCodeAsync(c, code)
  if (!event) {
    throw new APIError('not-found', 'event-not-found', 'Event not found')
  }

  const circles = await prisma.circle.findMany({
    where: { eventId: event.id }
  })
  const mappedCircles: Record<string, SoleilCircleAppModel> = circles.reduce((acc, circle) => ({
    ...acc,
    [circle.code]: {
      spaceNumber: circle.spaceNumber,
      name: circle.name,
      status: circle.status === 'Attend' ? 1 : circle.status === 'Absent' ? 2 : 0,
      updatedAt: circle.updatedAt?.getTime() || null
    }
  }), {})
  return c.json(mappedCircles)
})

export default eventsRouter
