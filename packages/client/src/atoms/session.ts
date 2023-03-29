import { atomWithStorage } from 'jotai/utils'
import type { SunflowerSession } from 'sunflower'

interface SessionType {
  sessionCode: string
  session: SunflowerSession
}
const session = atomWithStorage<SessionType | undefined>('session', undefined)

export default session
