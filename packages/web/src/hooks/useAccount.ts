import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms/credentials'
import useFetch from './useFetch'
import useToken from './useToken'
import type { LoggedInUser, LoginResult } from 'soleil'

interface UseAccount {
  user: LoggedInUser | null | undefined
  loginAsync: (loginToken: string, abort: AbortController) => Promise<LoginResult>
  loginDirectlyAsync: (abort: AbortController) => Promise<LoginResult>
  logoutAsync: () => Promise<void>
}
const useAccount = (): UseAccount => {
  const {
    loginToken,
    setLoginToken,
    setAPIToken
  } = useToken()
  const { postAsync } = useFetch()

  const [user, setUser] = useAtom(userAtom)

  const loginAsync = useCallback(async (token: string, abort: AbortController) => {
    const result = await postAsync<LoginResult>(
      '/accounts/login',
      { token },
      { abort })
      .then(res => {
        return res
      })
      .catch(err => {
        if (err.code === 'ERR_CANCELED') {
          throw err
        }
        setAPIToken(null)
        setUser(null)
        throw err
      })

    setAPIToken(result.token)
    setUser(result.user)

    return result
  }, [postAsync])

  const loginDirectlyAsync = useCallback(async (abort: AbortController) => {
    if (loginToken === undefined) {
      throw new Error('Login token is undefined')
    }
    if (!loginToken) {
      setUser(null)
      throw new Error('No login token available')
    }

    const result = await loginAsync(loginToken, abort)
      .catch(err => { throw err })

    return result
  }, [loginToken, loginAsync])

  const logoutAsync = useCallback(async () => {
    setLoginToken(null)
    setAPIToken(null)
    setUser(null)
  }, [])

  return {
    user,
    loginAsync,
    loginDirectlyAsync,
    logoutAsync
  }
}

export default useAccount
