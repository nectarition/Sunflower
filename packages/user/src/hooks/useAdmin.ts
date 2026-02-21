import { useCallback } from 'react'
import useFetch from './useFetch'
import type { Organization, SoleilEvent, User } from 'soleil'

interface UseAdmin {
  getOrganizationsAsync: (abort: AbortController) => Promise<Organization[]>
  getUsersAsync: (abort: AbortController) => Promise<User[]>
  getEventsAsync: (abort: AbortController) => Promise<SoleilEvent[]>
}

const useAdmin = (): UseAdmin => {
  const { getAsync } = useFetch()

  const getOrganizationsAsync = useCallback(async (abort: AbortController) => {
    const result = await getAsync<Organization[]>('/admin/organizations', { abort })
    return result
  }, [getAsync])

  const getUsersAsync = useCallback(async (abort: AbortController) => {
    const result = await getAsync<User[]>('/admin/users', { abort })
    return result
  }, [getAsync])

  const getEventsAsync = useCallback(async (abort: AbortController) => {
    const result = await getAsync<SoleilEvent[]>('/admin/events', { abort })
    return result
  }, [getAsync])
  
  return {
    getOrganizationsAsync,
    getUsersAsync,
    getEventsAsync
  }
}

export default useAdmin
