import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useNectaritionID from '../../hooks/useNectaritionID'
import RequiredLogin, { type RedirectAfterLogin } from '../../libs/RequiredLogin'

const OIDCCallbackPage: React.FC = () => {
  const { processCallbackAsync } = useNectaritionID()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const [redirectAfterLogin, setRedirectAfterLogin] = useState<RedirectAfterLogin>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const abort = new AbortController()
    if (!code || !state) return
    processCallbackAsync(code, state, abort)
      .then(res => {
        if (res.passwordResetToken) {
          setRedirectAfterLogin({ pathname: '/password-reset', state: { token: res.passwordResetToken } })
        } else {
          setRedirectAfterLogin({ pathname: '/' })
        }
      })
      .catch(err => {
        if (err.code === 'ERR_CANCELED') return
        console.error(err)
        setError(err.message || 'Unknown error')
      })
    return () => abort.abort()
  }, [code, state])

  return (
    <RequiredLogin
      allowAnonymous={true}
      redirectAfterLogin={redirectAfterLogin}>
      {error ? `エラーが発生しました: ${error}` : 'ログイン処理中...'}
    </RequiredLogin> 
  )
}

export default OIDCCallbackPage
