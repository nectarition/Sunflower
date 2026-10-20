import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useAccount from '../hooks/useAccount'

interface Props {
  children: React.ReactNode
}
const AuthenticationProvider: React.FC<Props> = (props) => {
  const { user, loginDirectlyAsync } = useAccount()
  const location = useLocation()

  useEffect(() => {
    if (user !== undefined) return
    const pathname = location.pathname.replace(/\/$/, '')
    if (pathname.endsWith('/oidc/callback')) return
    const abort = new AbortController()
    loginDirectlyAsync(abort)
      .catch((err) => { throw err })
    return () => abort.abort()
  }, [user, loginDirectlyAsync, location.pathname])
  
  return (
    <>
      {props.children}
    </>
  )
}

export default AuthenticationProvider
