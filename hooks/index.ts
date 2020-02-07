import { useState, useEffect, useRef } from 'react'
import { getWordCountFromMarkdown } from '../utils'

export const useLiveWordCount = (markdown: string) => {
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    const count = getWordCountFromMarkdown(markdown)
    setWordCount(count)
  }, [markdown])

  return wordCount
}

const noop = () => {}

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(noop)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current()
    if (delay) {
      const id = setInterval(tick, delay)

      return () => clearInterval(id)
    }
  }, [delay])
}

export const useAutoSaveOnEdit = (onEditCallback: (value: any) => void, onSaveCallback: () => void, delay = 5000) => {
  const [timeoutId, setTimeoutId] = useState<null | NodeJS.Timeout>(null)
  const [saved, setSaved] = useState(false)
  
  const resetTimeout = (id: NodeJS.Timeout | null, newId: NodeJS.Timeout) => {	
    if (id) clearTimeout(id)
    return newId
  }
  
  const saveValue = () => {
    setSaved(true)
    onSaveCallback()
    setTimeout(() => setSaved(false), 1000)	
  };

	const editValue = (value: any) => {
    const newId = resetTimeout(timeoutId, setTimeout(saveValue, delay))
    setTimeoutId(newId)
    onEditCallback(value)
  };
  
  return {
    saved,
    editValue,
  }
}
