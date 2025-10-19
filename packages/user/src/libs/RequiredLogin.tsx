import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAccount from '../hooks/useAccount'
import useSession from '../hooks/useSession'

interface Props {
  children: React.ReactNode
  allowAnonymous?: boolean
}
const RequiredLogin: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAccount()
  const { session } = useSession()

  useEffect(() => {
    if (user === undefined) return
    if (props.allowAnonymous && user === null) return
    if (user !== null && session !== undefined && location.pathname === '/login') {
      const beforeLocationPath = `${location.state?.from?.pathname ?? ''}${location.state?.from?.search ?? ''}` || '/'
      navigate(beforeLocationPath, { replace: true })
      return
    }
    if (user !== null) return
    navigate('/login', {
      state: { from: (location.pathname !== '/' && location) || undefined },
      replace: true
    })
  }, [user])

  return <>
    {(user || props.allowAnonymous) && props.children}
  </>
}

export default RequiredLogin
