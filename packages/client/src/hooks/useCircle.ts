import { useCallback } from 'react'
import { get, ref, serverTimestamp, set, update } from 'firebase/database'
import useFirebase from './useFirebase'
import type { SoleilCircle, SoleilCircleAppModel, SoleilCircleStatus } from 'sunflower'

interface IUseCircle {
  convertCodeDataByCircleCode: (codeData: string) => { sessionCode: string, circleId: string } | null
  getCircleByCodeAsync: (circleCode: string) => Promise<SoleilCircleAppModel>
  updateCircleStatusByCodeAsync: (circleCode: string, status: SoleilCircleStatus) => Promise<void>
  getCirclesBySessionCodeAsync: (sessionCode: string) => Promise<Record<string, SoleilCircleAppModel>>
  createCirclesAsync: (sessionCode: string, circles: Record<string, SoleilCircle>) => Promise<void>
}

const useCircle = (): IUseCircle => {
  const { getDatabase } = useFirebase()
  const db = getDatabase()

  const convertCodeDataByCircleCode =
    useCallback((data: string) => {
      const codeData = data.match(/^(.+)-(\d{4})$/)
      if (!codeData) {
        return null
      }

      const sessionCode = codeData[1]
      const circleId = codeData[2]

      return { sessionCode, circleId }
    }, [])

  const getCircleByCodeAsync =
    useCallback(async (circleCode: string): Promise<SoleilCircleAppModel> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }

      const circleRef = ref(db, `circles/${codeData.sessionCode}/${circleCode}`)
      const circleDoc = await get(circleRef)
      if (!circleDoc.exists()) {
        throw new Error('circle not found')
      }

      const circle = circleDoc.val() as SoleilCircleAppModel
      return circle
    }, [])

  const updateCircleStatusByCodeAsync =
    useCallback(async (circleCode: string, status: SoleilCircleStatus): Promise<void> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }

      const circleRef = ref(db, `circles/${codeData.sessionCode}/${circleCode}`)
      const circleDoc = await get(circleRef)
      if (!circleDoc.exists()) {
        throw new Error('circle not found')
      }
      
      const circle = {
        status,
        updatedAt: serverTimestamp()
      }
      await update(circleRef, circle)
    }, [])

  const getCirclesBySessionCodeAsync =
    useCallback(async (sessionCode: string): Promise<Record<string, SoleilCircleAppModel>> => {
      const circlesRef = ref(db, `circles/${sessionCode}`)
      const circlesDoc = await get(circlesRef)
      const circles = circlesDoc.val() as Record<string, SoleilCircleAppModel>
      return circles
    }, [])

  const createCirclesAsync =
    useCallback(async (sessionCode: string, circles: Record<string, SoleilCircle>): Promise<void> => {
      const circlesRef = ref(db, `circles/${sessionCode}`)
      await set(circlesRef, circles)
    }, [])

  return {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync,
    getCirclesBySessionCodeAsync,
    createCirclesAsync
  }
}

export default useCircle
