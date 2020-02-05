import { useState, useEffect } from 'react'
import { getWordCountFromMarkdown } from '../utils'

export const useLiveWordCount = (markdown: string) => {
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    const count = getWordCountFromMarkdown(markdown)
    setWordCount(count)
  }, [markdown])

  return wordCount
}
