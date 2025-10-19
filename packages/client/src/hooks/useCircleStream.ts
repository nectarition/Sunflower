import { useEffect, useState } from 'react'
import { ref, onValue, DataSnapshot, off } from 'firebase/database'
import useFirebase from './useFirebase'
import type { SoleilCircleAppModel } from 'soleil'

const useCircleStream = (sessionCode: string | undefined): Record<string, SoleilCircleAppModel> | undefined => {
  const { getDatabase } = useFirebase()
  const db = getDatabase()

  const [streamCircles, setStreamCircles] = useState<Record<string, SoleilCircleAppModel>>()

  useEffect(() => {
    if (!sessionCode) return
    
    const circleRef = ref(db, `circles/${sessionCode}`)
    const unsubscribe = onValue(
      circleRef,
      (snapshot: DataSnapshot) => {
        setStreamCircles(snapshot.val() as Record<string, SoleilCircleAppModel>)
      }, (err) => {
        console.error(err)
        throw err
      }
    )
    return () => {
      off(circleRef, 'value', unsubscribe)
    }
  }, [sessionCode])

  return streamCircles
}

export default useCircleStream
