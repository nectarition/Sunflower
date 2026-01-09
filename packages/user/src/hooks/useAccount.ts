import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { userAtom } from '../atoms/credentials'
import useFetch from './useFetch'
import useToken from './useToken'
import type { AuthenticateResult, LoggedInUser, LoginResult } from 'soleil'

interface UseAccount {
  user: LoggedInUser | null | undefined
  createAccountAsync: (email: string, password: string, name: string, abort: AbortController) => Promise<void>
  authenticateAsync: (email: string, password: string, abort: AbortController) => Promise<LoginResult>
  loginAsync: (loginToken: string, abort: AbortController) => Promise<LoginResult>
  loginDirectlyAsync: (abort: AbortController) => Promise<LoginResult>
  logoutAsync: () => Promise<void>
  verifyEmailAsync: (token: string, abort: AbortController) => Promise<void>
  sendPasswordResetEmailAsync: (email: string, abort: AbortController) => Promise<void>
  resetPasswordAsync: (token: string, password: string, abort: AbortController) => Promise<void>
}
const useAccount = (): UseAccount => {
  const {
    loginToken,
    apiToken,
    setLoginToken,
    setAPIToken
  } = useToken()
  const { postAsync } = useFetch()

  const [user, setUser] = useAtom(userAtom)

  const createAccountAsync = useCallback(
    async (email: string, password: string, name: string, abort: AbortController): Promise<void> => {
      await postAsync<AuthenticateResult>('/accounts', {
        email,
        password,
        name
      }, { abort })
    }, [postAsync])

  const authenticateAsync = useCallback(async (email: string, password: string, abort: AbortController) => {
    const result = await postAsync<AuthenticateResult>('/accounts/authenticate', {
      email,
      password
    }, { abort })
    setLoginToken(result.token)

    const loginResult = await loginAsync(result.token, abort)
      .catch(err => { throw err })

    return loginResult
  }, [postAsync])

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

  const verifyEmailAsync = useCallback(
    async (token: string, abort: AbortController): Promise<void> => {
      await postAsync('/accounts/verify-email', { token }, { abort })
    }, [postAsync])

  const sendPasswordResetEmailAsync = useCallback(
    async (email: string, abort: AbortController): Promise<void> => {
      await postAsync('/accounts/send-password-reset-email', { email }, { abort })
    }, [postAsync])

  const resetPasswordAsync = useCallback(
    async (token: string, password: string, abort: AbortController): Promise<void> => {
      await postAsync('/accounts/reset-password', { token, password }, { abort })
    }, [postAsync])

  useEffect(() => {
    if (loginToken === undefined) {
      setUser(undefined)
    } else if (loginToken === null && !apiToken) {
      setUser(null)
    }
  }, [loginToken, apiToken])

  return {
    user,
    createAccountAsync,
    authenticateAsync,
    loginAsync,
    loginDirectlyAsync,
    logoutAsync,
    verifyEmailAsync,
    sendPasswordResetEmailAsync,
    resetPasswordAsync
  }
}

export default useAccount
