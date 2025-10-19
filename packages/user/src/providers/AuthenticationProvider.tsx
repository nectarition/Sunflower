import { useEffect } from 'react'
import useAccount from '../hooks/useAccount'

interface Props {
  children: React.ReactNode
}
const AuthenticationProvider: React.FC<Props> = (props) => {
  const { user, loginDirectlyAsync } = useAccount()

  useEffect(() => {
    if (user !== undefined) return
    const abort = new AbortController()
    loginDirectlyAsync(abort)
      .catch((err) => { throw err })
    return () => {
      abort.abort()
    }
  }, [user, loginDirectlyAsync])
  
  return (
    <>
      {props.children}
    </>
  )
}

export default AuthenticationProvider
