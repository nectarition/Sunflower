import { } from 'react'

import { useAtom } from 'jotai'
import sessionAtom from '../atoms/session'

interface IUseSession {
  getSessionByCodeAsync: (code: string) => 
}
const useSession: () => IUseSession =
  () => {
    const getSessionByCodeAsync: (code: string) => =
      () => {

      }

    return {
      getSessionByCodeAsync
    }
  }

export default useSession
