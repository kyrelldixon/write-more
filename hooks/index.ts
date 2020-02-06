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
