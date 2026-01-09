import { atomWithStorage } from 'jotai/utils'
import type { SessionState } from 'soleil'

const session = atomWithStorage<SessionState | undefined>('soleil:session', undefined)

export default session
