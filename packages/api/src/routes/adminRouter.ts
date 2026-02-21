import { Hono } from 'hono'
import { Bindings, Variables } from '../@types'
import requiredAdmin from '../middlewares/requiredAdmin'
import requiredLogin from '../middlewares/requiredLogin'

const router = new Hono<{ Bindings: Bindings, Variables: Variables }>()

router.get('/admin/organizations', requiredLogin, requiredAdmin, async (c) => {
  const prisma = c.get('prisma')
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true
    }
  })
  return c.json(organizations)
})

router.get('/admin/users', requiredLogin, requiredAdmin, async (c) => {
  const prisma = c.get('prisma')
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      isAdmin: true
    }
  })
  return c.json(users)
})

router.get('/admin/events', requiredLogin, requiredAdmin, async (c) => {
  const prisma = c.get('prisma')
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })
  return c.json(events)
})

export default router
