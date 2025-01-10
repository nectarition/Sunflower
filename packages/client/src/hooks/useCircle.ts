import * as FirebaseDB from 'firebase/database'
import useFirebase from './useFirebase'
import type { SunflowerCircle, SunflowerCircleAppModel, SunflowerCircleStatus } from 'sunflower'

interface IUseCircle {
  convertCodeDataByCircleCode: (codeData: string) => { sessionCode: string, circleId: string } | null
  getCircleByCodeAsync: (circleCode: string) => Promise<SunflowerCircleAppModel>
  updateCircleStatusByCodeAsync: (circleCode: string, status: SunflowerCircleStatus) => Promise<void>
  getCirclesBySessionCodeAsync: (sessionCode: string) => Promise<Record<string, SunflowerCircleAppModel>>
  createCirclesAsync: (sessionCode: string, circles: Record<string, SunflowerCircle>) => Promise<void>
}

const useCircle = (): IUseCircle => {
  const { getDatabase } = useFirebase()

  const convertCodeDataByCircleCode =
    (data: string): { sessionCode: string, circleId: string } | null => {
      const codeData = data.match(/^(.+)-(\d{4})$/)
      if (!codeData) {
        return null
      }

      const sessionCode = codeData[1]
      const circleId = codeData[2]

      return { sessionCode, circleId }
    }

  const getCircleByCodeAsync =
    async (circleCode: string): Promise<SunflowerCircleAppModel> => {
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

      const circle = circleDoc.val() as SunflowerCircleAppModel
      return circle
    }

  const updateCircleStatusByCodeAsync =
    async (circleCode: string, status: SunflowerCircleStatus): Promise<void> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }

      const db = getDatabase()
      const circleRef = FirebaseDB.ref(db, `circles/${codeData.sessionCode}/${circleCode}`)
      const circle = {
        status,
        updatedAt: FirebaseDB.serverTimestamp()
      }
      await FirebaseDB.update(circleRef, circle)
    }

  const getCirclesBySessionCodeAsync =
    async (sessionCode: string): Promise<Record<string, SunflowerCircleAppModel>> => {
      const db = getDatabase()
      const circlesRef = FirebaseDB.ref(db, `circles/${sessionCode}`)
      const circlesDoc = await FirebaseDB.get(circlesRef)

      const circles = circlesDoc.val() as Record<string, SunflowerCircleAppModel>
      return circles
    }

  const createCirclesAsync =
    async (sessionCode: string, circles: Record<string, SunflowerCircle>): Promise<void> => {
      const db = getDatabase()
      const circlesRef = FirebaseDB.ref(db, `circles/${sessionCode}`)
      await FirebaseDB.set(circlesRef, circles)
    }

  return {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync,
    getCirclesBySessionCodeAsync,
    createCirclesAsync
  }
}

export default useCircle
