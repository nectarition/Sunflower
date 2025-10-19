import { useCallback } from 'react'
import useFetch from './useFetch'
import type { SoleilCircle, SoleilCircleAppModel, SoleilCircleStatus } from 'soleil'

interface IUseCircle {
  convertCodeDataByCircleCode: (codeData: string) => { sessionCode: string, circleId: string } | null
  getCircleByCodeAsync: (circleCode: string, abort: AbortController) => Promise<SoleilCircleAppModel>
  updateCircleStatusByCodeAsync: (circleCode: string, status: SoleilCircleStatus, abort: AbortController) => Promise<void>
  getCirclesBySessionCodeAsync: (sessionCode: string, abort: AbortController) => Promise<Record<string, SoleilCircleAppModel>>
  createCirclesAsync: (sessionCode: string, circles: Record<string, SoleilCircle>, abort: AbortController) => Promise<void>
}

const useCircle = (): IUseCircle => {
  const { postAsync, getAsync } = useFetch()

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
    useCallback(async (circleCode: string, abort: AbortController): Promise<SoleilCircleAppModel> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }
      const circle = await getAsync<SoleilCircleAppModel>(`/circles/${codeData.sessionCode}/${circleCode}`, { requiredAuthorize: true, abort })
      return circle
    }, [])

  const updateCircleStatusByCodeAsync =
    useCallback(async (circleCode: string, status: SoleilCircleStatus, abort: AbortController): Promise<void> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }
      await postAsync<void>(`/circles/${codeData.sessionCode}/${circleCode}/status`, { status }, { requiredAuthorize: true, abort })
    }, [])

  const getCirclesBySessionCodeAsync =
    useCallback(async (sessionCode: string, abort: AbortController): Promise<Record<string, SoleilCircleAppModel>> => {
      const circles = await getAsync<Record<string, SoleilCircleAppModel>>(`/circles/${sessionCode}`, { requiredAuthorize: true, abort })
      return circles
    }, [])

  const createCirclesAsync =
    useCallback(async (sessionCode: string, circles: Record<string, SoleilCircle>, abort: AbortController): Promise<void> => {
      await postAsync<void>(`/circles/${sessionCode}`, circles, { requiredAuthorize: true, abort })
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
