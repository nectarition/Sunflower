import { atomWithStorage } from 'jotai/utils'

interface SessionType {
  sessionCode: string
}
const session = atomWithStorage<SessionType | undefined>('session', undefined)

export default session
