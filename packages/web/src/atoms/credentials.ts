import { atom } from 'jotai'
import type { LoggedInUser } from '../../../@types'

const apiTokenAtom = atom<string | null>(null)
const userAtom = atom<LoggedInUser | null | undefined>(undefined)

export {
  apiTokenAtom,
  userAtom
}
