import { useCallback } from 'react'

interface IUseDate {
  formatDate: (date: Date | string) => string
  convertDateOnly: (date: Date | string) => Date
}

const useDate = (): IUseDate => {
  const formatDate = useCallback((date: Date | string) => {
    const typedDate =  typeof date === 'string'
      ? new Date(date)
      : date
    const year = typedDate.getFullYear()
    const month = typedDate.getMonth() + 1
    const day = typedDate.getDate()
    return `${year}/${month}/${day}`
  }, [])

  const convertDateOnly = useCallback((date: Date | string) => {
    const typedDate =  typeof date === 'string'
      ? new Date(date)
      : date
    return new Date(typedDate.getFullYear(), typedDate.getMonth(), typedDate.getDate())
  }, [])

  return {
    formatDate,
    convertDateOnly
  }
}

export default useDate
