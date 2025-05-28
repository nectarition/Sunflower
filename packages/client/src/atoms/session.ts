import { atomWithStorage } from 'jotai/utils'
import type { SoleilSession } from 'sunflower'

interface SessionType {
  sessionCode: string
  session: SoleilSession
}
const session = atomWithStorage<SessionType | undefined>('session', undefined)

export default session
