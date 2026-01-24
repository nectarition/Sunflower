import { useCallback, useState } from 'react'
import Axios, { type AxiosRequestConfig } from 'axios'
import { useSetAtom } from 'jotai'
import { userAtom } from '../atoms/credentials'
import useToken from './useToken'
import type { LoginResult } from '../../../@types'

interface UseFetch {
  isConnected: boolean | undefined
  checkConnection: (abort: AbortController) => void
  getAsync: <T>(endpoint: string, o: { requiredAuthorize?: boolean, abort: AbortController }) => Promise<T>
  postAsync: <T>(endpoint: string, body: object, o: { requiredAuthorize?: boolean, abort: AbortController }) => Promise<T>
  deleteAsync: <T>(endpoint: string, o: { requiredAuthorize?: boolean, abort: AbortController }) => Promise<T>
}
const useFetch = (): UseFetch => {
  const [isConnected, setConnected] = useState<boolean>()
  const {
    loginToken,
    apiToken,
    setAPIToken
  } = useToken()

  const setUser = useSetAtom(userAtom)

  const axios = Axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
  })

  let isRetry = false
  axios.interceptors.response.use(
    res => res,
    err => {
      if (err.code === 'ERR_CANCELED' || err.code === 'ERR_NETWORK' || (!apiToken && err.response.status)) {
        throw err
      } else if (apiToken && err.response.status === 401 && !isRetry) {
        isRetry = true
        const loginAsync = async (): Promise<LoginResult> => {
          const result = await axios.post<LoginResult>('/accounts/login', { loginToken })
          return result.data
        }
        loginAsync()
          .then(async (result) => {
            setAPIToken(result.token)
            setUser(result.user)
            await axios(err.config as AxiosRequestConfig)
          })
          .catch(err => { throw err })
      }
      throw err
    })

  const getAsync = useCallback(async <T>(endpoint: string, o: { requiredAuthorize?: boolean, abort: AbortController }): Promise<T> => {
    if (o.requiredAuthorize && !apiToken) {
      throw new Error('Unauthorized')
    }

    const result = await axios.get<T>(
      endpoint,
      {
        headers: (apiToken && { Authorization: `Bearer ${apiToken}` }) || undefined,
        signal: o.abort.signal
      })
      .catch(err => { throw err })

    return result.data
  }, [apiToken])

  const postAsync = useCallback(async <T>(endpoint: string, body: object, o: { requiredAuthorize?: boolean, abort: AbortController }): Promise<T> => {
    if (o.requiredAuthorize && !apiToken) {
      throw new Error('unauthorized')
    }

    const result = await axios.post<T>(
      endpoint,
      body,
      {
        headers: (apiToken && { Authorization: `Bearer ${apiToken}` }) || undefined,
        signal: o.abort.signal
      })
      .catch(err => { throw err })

    return result.data
  }, [apiToken])

  const deleteAsync = useCallback(async <T>(endpoint: string, o: { requiredAuthorize?: boolean, abort: AbortController }): Promise<T> => {
    if (o.requiredAuthorize && !apiToken) {
      throw new Error('unauthorized')
    }

    const result = await axios.delete<T>(
      endpoint,
      {
        headers: (apiToken && { Authorization: `Bearer ${apiToken}` }) || undefined,
        signal: o.abort.signal
      })
      .catch(err => { throw err })

    return result.data
  }, [apiToken])

  const checkConnection = useCallback((abort: AbortController): void => {
    getAsync('/', { abort })
      .then(() => setConnected(true))
      .catch(err => {
        if (err.code === 'ERR_CANCELED') return
        setConnected(false)
      })
  }, [getAsync])

  return {
    isConnected,
    checkConnection,
    getAsync,
    postAsync,
    deleteAsync
  }
}

export default useFetch
