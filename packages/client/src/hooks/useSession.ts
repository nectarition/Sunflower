import { useEffect, useState } from 'react'

import * as FirebaseDB from 'firebase/database'

import { useAtom } from 'jotai'
import sessionAtom from '../atoms/session'
import useFirebase from './useFirebase'

interface IUseSession {
  sessionCode: string | undefined
  sessionName: string | undefined
  fetchSessionByCodeAsync: (code: string) => Promise<void>
  resetSession: () => void
}
const useSession: () => IUseSession =
  () => {
    const { getDatabase } = useFirebase()

    const [sessionContext, setSessionContext] = useAtom(sessionAtom)
    const [sessionCode, setSessionCode] = useState<string>()
    const [sessionName, setSessionName] = useState<string>()

    const onUpdatedContext: () => void =
      () => {
        setSessionCode(sessionContext?.sessionCode)
        setSessionName(sessionContext?.session.name)
      }
    useEffect(onUpdatedContext, [sessionContext])

    const fetchSessionByCodeAsync: (code: string) => Promise<void> =
      async (code) => {
        const db = getDatabase()
        const sessionRef = FirebaseDB.ref(db, `sessions/${code}`)
        const sessionSnap = await FirebaseDB.get(sessionRef)
        if (!sessionSnap.exists()) {
          throw new Error('session not found')
        }

        const sessionData = sessionSnap.val()
        setSessionContext({
          session: {
            name: sessionData.name
          },
          sessionCode: code
        })
      }

    const resetSession: () => void =
      () => {
        setSessionContext(undefined)
      }

    return {
      sessionCode,
      sessionName,
      fetchSessionByCodeAsync,
      resetSession
    }
  }

export default useSession
