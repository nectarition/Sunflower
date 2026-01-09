import { useCallback } from 'react'
import useFetch from './useFetch'
import type { SoleilEvent } from 'soleil'

interface IUseEvent {
  getEventByCodeAsync: (code: string, abort: AbortController) => Promise<SoleilEvent>
  getEventsAsync: (abort: AbortController) => Promise<SoleilEvent[]>
}

const useEvent = (): IUseEvent => {
  const { getAsync } = useFetch()

  const getEventByCodeAsync = useCallback(async (code: string, abort: AbortController): Promise<SoleilEvent> => 
    await getAsync<SoleilEvent>(`/events/${code}`, { abort, requiredAuthorize: true }), [getAsync])

  const getEventsAsync = useCallback(async (abort: AbortController): Promise<SoleilEvent[]> => 
    await getAsync<SoleilEvent[]>('/events', { abort, requiredAuthorize: true }), [getAsync])

  return {
    getEventByCodeAsync,
    getEventsAsync
  }
}

export default useEvent
