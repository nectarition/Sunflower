import { useCallback } from 'react'

interface IUseDate {
  formatDate: (date: Date | string) => string
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

  return {
    formatDate
  }
}

export default useDate
