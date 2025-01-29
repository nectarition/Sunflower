import { useState } from 'react'

import * as FirebaseDB from 'firebase/database'
import useFirebase from './useFirebase'
import type { SunflowerCircleAppModel } from 'sunflower'

interface IUseCircleStream {
  streamCircles: Record<string, SunflowerCircleAppModel> | undefined
  startStreamBySessionCode: (sessionCode: string) => void
}

const useCircleStream = (): IUseCircleStream => {
  const { getDatabase } = useFirebase()
  const [streamCircles, setStreamCircles] = useState<Record<string, SunflowerCircleAppModel>>()

  const startStreamBySessionCode =
    (sessionCode: string): FirebaseDB.Unsubscribe => {
      const db = getDatabase()
      const circleRef = FirebaseDB.ref(db, `circles/${sessionCode}`)
      return FirebaseDB.onValue(
        circleRef,
        (snapshot: FirebaseDB.DataSnapshot) => {
          setStreamCircles(snapshot.val() as Record<string, SunflowerCircleAppModel>)
        },
        (err: Error) => {
          console.log(err)
          throw err
        })
    }

  return {
    streamCircles,
    startStreamBySessionCode
  }
}

export default useCircleStream
