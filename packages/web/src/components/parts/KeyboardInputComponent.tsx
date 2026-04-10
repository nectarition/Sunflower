import { useEffect, useRef, useState } from 'react'

interface Props {
  onData: (data: string) => void
  onKeyDown: (data: string) => void
}
const KeyboardInputComponent: React.FC<Props> = props => {
  const value = useRef<string>('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (value.current.trim()) {
          props.onData(value.current.trim())
          value.current = ''
        }
      } else if (event.key.length === 1) {
        value.current += event.key
      } else if (event.key === 'Backspace') {
        value.current = value.current.slice(0, -1)
      }
      props.onKeyDown(value.current)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [props.onData, props.onKeyDown])
  
  return null
}

export default KeyboardInputComponent;
