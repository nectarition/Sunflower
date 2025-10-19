import { useCallback } from 'react'
import { useAtom } from 'jotai'
import sessionAtom from '../atoms/session'
import useFetch from './useFetch'
import type { SessionState } from 'soleil'

interface IUseSession {
  sessionState: SessionState | undefined
  fetchSessionByCodeAsync: (code: string, abort: AbortController) => Promise<void>
  resetSession: () => void
}

const useSession = (): IUseSession => {
  const { getAsync } = useFetch()
  const [sessionContext, setSessionContext] = useAtom(sessionAtom)

  const fetchSessionByCodeAsync = useCallback(async (code: string, abort: AbortController): Promise<void> => {
    const session = await getAsync<{ name: string }>(`/sessions/${code}`, { abort })
      .catch(err => { throw err })
    setSessionContext({
      session: {
        name: session.name
      },
      sessionCode: code
    })
  }, [getAsync])

  const resetSession = useCallback(() => setSessionContext(undefined), [])

  return {
    sessionState: sessionContext,
    fetchSessionByCodeAsync,
    resetSession
  }
}

export default useSession
