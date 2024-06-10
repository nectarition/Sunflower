import { useEffect, useState } from 'react'
import { type FirebaseError } from 'firebase/app'
import {
  type Auth,
  type User,
  type UserCredential,
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onIdTokenChanged
} from 'firebase/auth'
import { type Database, getDatabase as getFirebaseDatabase } from 'firebase/database'
import { type Firestore, getFirestore as getFirebaseFirestore } from 'firebase/firestore'
import { type FirebaseStorage, getStorage as getFirebaseStorage } from 'firebase/storage'
import { getFirebaseApp } from '../libs/FirebaseApp'

interface IUseFirebase {
  isLoggedIn: boolean | undefined
  user: User | null | undefined
  getAuth: () => Auth
  loginByEmail: (email: string, password: string) => Promise<UserCredential>
  logout: () => void
  createUser: (email: string, password: string) => Promise<User>
  sendPasswordResetURL: (email: string) => void
  getFirestore: () => Firestore
  getStorage: () => FirebaseStorage
  getDatabase: () => Database
}

const useFirebase = (): IUseFirebase => {
  const [auth, setAuth] = useState<Auth | undefined>()
  const [isLoggedIn, setLoggedIn] = useState<boolean | undefined>()
  const [user, setUser] = useState<User | null | undefined>()

  const getAuth = (): Auth => {
    if (auth) {
      return auth
    }

    const app = getFirebaseApp()
    const _auth = getFirebaseAuth(app)
    setAuth(_auth)

    return _auth
  }

  const loginByEmail =
    async (email: string, password: string): Promise<UserCredential> => {
      const auth = getAuth()
      const credential = await signInWithEmailAndPassword(auth, email, password)
        .catch((err: FirebaseError) => {
          throw err
        })
      return credential
    }

  const logout = (): void => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        setUser(null)
        setLoggedIn(false)
      })
      .catch((err: FirebaseError) => {
        throw err
      })
  }

  const createUser =
    async (email: string, password: string): Promise<User> => {
      const auth = getAuth()
      return await createUserWithEmailAndPassword(auth, email, password)
        .then(cred => cred.user)
        .catch(err => {
          throw err
        })
    }

  const sendPasswordResetURL = (email: string): void => {
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
      .catch((err: FirebaseError) => {
        throw err
      })
  }

  const getFirestore = (): Firestore => getFirebaseFirestore()

  const getStorage = (): FirebaseStorage => getFirebaseStorage()

  const getDatabase = (): Database => getFirebaseDatabase()

  useEffect(() => {
    const auth = getAuth()
    const unSubscribe = onIdTokenChanged(auth, (user) => {
      setUser(user)
      setLoggedIn(!!user)
    })
    return unSubscribe
  }, [])

  return {
    isLoggedIn,
    user,
    getAuth,
    loginByEmail,
    logout,
    createUser,
    sendPasswordResetURL,
    getFirestore,
    getStorage,
    getDatabase
  }
}

export default useFirebase
