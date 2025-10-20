import { SoleilEvent } from 'soleil'
import type { APIContext } from '../@types'
 
const getEventByCodeAsync = async (c: APIContext, eventCode: string): Promise<(SoleilEvent & { id: number }) | null> => {
  const prisma = c.get('prisma')
  const user = c.get('user')
  const event = await prisma.event.findUnique({
    where: {
      code: eventCode,
      organization: {
        organizationUsers: {
          every: {
            userId: user.id
          }
        }
      }
    }
  })
  if (!event) {
    return null
  }
  return {
    id: event.id,
    code: event.code,
    name: event.name
  }
}

export default {
  getEventByCodeAsync
}
