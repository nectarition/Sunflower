import { useState } from 'react'

const useFile = () => {
  const [ data, setData ] = useState('')
  const [ error, setError ] = useState<DOMException | null>(null)

  const openAsText = async (file: Blob) => {
    const reader = new FileReader()
    reader.onerror = () => setError(reader.error)
    reader.onload = () => setData((reader.result as string) || '')

    reader.readAsText(file)
  }

  const openAsDataURL = async (file: Blob) => {
    const reader = new FileReader()
    reader.onerror = () => setError(reader.error)
    reader.onload = () => setData((reader.result as string) || '')

    reader.readAsDataURL(file)
  }

  return { data, error, openAsText, openAsDataURL }
}

export default useFile
