import { useCallback } from 'react'
import useFetch from './useFetch'
import type { SoleilCircle, SoleilCircleAppModel, SoleilCircleStatus } from 'soleil'

interface IUseCircle {
  convertCodeDataByCircleCode: (codeData: string) => { eventCode: string, circleId: string } | null
  getCircleByCodeAsync: (circleCode: string, abort: AbortController) => Promise<SoleilCircleAppModel>
  updateCircleStatusByCodeAsync: (circleCode: string, status: SoleilCircleStatus, abort: AbortController) => Promise<void>
  getCirclesByEventCodeAsync: (eventCode: string, abort: AbortController) => Promise<Record<string, SoleilCircleAppModel>>
  createCirclesAsync: (eventCode: string, circles: Record<string, SoleilCircle>, abort: AbortController) => Promise<void>
}

const useCircle = (): IUseCircle => {
  const { postAsync, getAsync } = useFetch()

  const convertCodeDataByCircleCode =
    useCallback((data: string) => {
      const codeData = data.match(/^(.+)-(\d{4})$/)
      if (!codeData) {
        return null
      }
      const eventCode = codeData[1]
      const circleId = codeData[2]
      return { eventCode, circleId }
    }, [])

  const getCircleByCodeAsync =
    useCallback(async (circleCode: string, abort: AbortController): Promise<SoleilCircleAppModel> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }
      const circle = await getAsync<SoleilCircleAppModel>(`/circles/${codeData.eventCode}/${circleCode}`, { requiredAuthorize: true, abort })
      return circle
    }, [getAsync])

  const updateCircleStatusByCodeAsync =
    useCallback(async (circleCode: string, status: SoleilCircleStatus, abort: AbortController): Promise<void> => {
      const codeData = convertCodeDataByCircleCode(circleCode)
      if (!codeData) {
        throw new Error('invalid circleCode')
      }
      await postAsync<void>(`/circles/${codeData.eventCode}/${circleCode}/status`, { status }, { requiredAuthorize: true, abort })
    }, [postAsync])

  const getCirclesByEventCodeAsync =
    useCallback(async (eventCode: string, abort: AbortController): Promise<Record<string, SoleilCircleAppModel>> => {
      const circles = await getAsync<Record<string, SoleilCircleAppModel>>(`/events/${eventCode}/circles`, { requiredAuthorize: true, abort })
      return circles
    }, [getAsync])

  const createCirclesAsync =
    useCallback(async (eventCode: string, circles: Record<string, SoleilCircle>, abort: AbortController): Promise<void> => {
      await postAsync<void>(`/events/${eventCode}/circles`, circles, { requiredAuthorize: true, abort })
    }, [postAsync])

  return {
    convertCodeDataByCircleCode,
    getCircleByCodeAsync,
    updateCircleStatusByCodeAsync,
    getCirclesByEventCodeAsync,
    createCirclesAsync
  }
}

export default useCircle
