import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAccount from '../hooks/useAccount'

interface Props {
  children: React.ReactNode
  allowAnonymous?: boolean
}
const RequiredLogin: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAccount()

  useEffect(() => {
    if (user === undefined) return
    if (props.allowAnonymous && user === null) return
    if (user !== null && location.pathname === '/login') {
      const beforeLocationPath = `${location.state?.from?.pathname ?? ''}${location.state?.from?.search ?? ''}` || '/'
      navigate(beforeLocationPath, { replace: true })
      return
    }
    if (user !== null) return
    navigate('/login', {
      state: { from: (location.pathname !== '/' && location) || undefined },
      replace: true
    })
  }, [user, location])

  return <>
    {(user || props.allowAnonymous) && props.children}
  </>
}

export default RequiredLogin
