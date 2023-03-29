import { useEffect, useState } from 'react'
import type { SunflowerCircle, SunflowerCircleStatus } from 'sunflower'

import * as FirebaseDB from 'firebase/database'
import useFirebase from './useFirebase'

interface IUseCircle {
  convertCodeDataByCircleCode: (codeData: string) => { sessionCode: string, circleId: string } | null
  getCircleByCodeAsync: (circleCode: string) => Promise<SunflowerCircle>
  updateCircleStatusByCodeAsync: (circleCode: string, status: SunflowerCircleStatus) => Promise<void>
  getCirclesBySessionCodeAsync: (sessionCode: string) => Promise<Record<string, SunflowerCircle>>
  createCircles: (sessionCode: string, circles: Record<string, SunflowerCircle>) => Promise<void>
}
const useCircle: () => IUseCircle =
  () => {
    const { getDatabase } = useFirebase()

    const convertCodeDataByCircleCode: (data: string) => { sessionCode: string, circleId: string } | null =
      (data) => {
        const codeData = data.match(/^(.+)-(\d{4})$/)
        if (!codeData) {
          return null
        }

        const sessionCode = codeData[1]
        const circleId = codeData[2]

        return { sessionCode, circleId }
      }

    const getCircleByCodeAsync: (circleCode: string) => Promise<SunflowerCircle> =
      async (circleCode) => {
        const codeData = convertCodeDataByCircleCode(circleCode)
        if (!codeData) {
          throw new Error('invalid circleCode')
        }

        const db = getDatabase()
        const circleRef = FirebaseDB.ref(db, `circles/${codeData.sessionCode}/${circleCode}`)
        const circleDoc = await FirebaseDB.get(circleRef)
        if (!circleDoc.exists()) {
          throw new Error('circle not found')
        }

        return circleDoc.val() as SunflowerCircle
      }

    const updateCircleStatusByCodeAsync: (circleCode: string, status: SunflowerCircleStatus) => Promise<void> =
      async (circleCode, status) => {
        const codeData = convertCodeDataByCircleCode(circleCode)
        if (!codeData) {
          throw new Error('invalid circleCode')
        }

        const db = getDatabase()
        const circleRef = FirebaseDB.ref(db, `circles/${codeData.sessionCode}/${circleCode}`)
        await FirebaseDB.update(circleRef, { status })
      }

    const getCirclesBySessionCodeAsync: (sessionCode: string) => Promise<Record<string, SunflowerCircle>> =
      async (sessionCode) => {
        const db = getDatabase()
        const circlesRef = FirebaseDB.ref(db, `circles/${sessionCode}`)
        const circlesDoc = await FirebaseDB.get(circlesRef)

        const circles = circlesDoc.val() as Record<string, SunflowerCircle>
        return circles
      }

    const createCircles: (sessionCode: string, circles: Record<string, SunflowerCircle>) => Promise<void> =
      async (sessionCode, circles) => {
        const db = getDatabase()
        const circlesRef = FirebaseDB.ref(db, `circles/${sessionCode}`)
        await FirebaseDB.update(circlesRef, circles)
      }

    return {
      convertCodeDataByCircleCode,
      getCircleByCodeAsync,
      updateCircleStatusByCodeAsync,
      getCirclesBySessionCodeAsync,
      createCircles
    }
  }

export default useCircle
