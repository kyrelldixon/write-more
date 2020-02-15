import removeMd from 'remove-markdown'
import { DailyWriting } from '../types'

export const getWordCountFromMarkdown = (markdown: string) => {
  const plainText = removeMd(markdown)
  const trimmed = plainText.trim()
  const words = trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []
  const wordCount = trimmed ? (words).length : 0
  return wordCount
}

export const formatDate = (utcDate: string, short = false) => {
  const date = new Date(utcDate)
  const options = 
    short ?
      {} :
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  
  return date.toLocaleDateString("en-US", options)
}

export const isToday = (someDate: string) => {
  const today = new Date()
  const date = new Date(someDate)
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
}

export const getDaysInRow = (writings: DailyWriting[], goal: number) => {
  let streak = 0
  let currentDate = new Date()
  if (writings.length === 0) {
    return streak
  }

  for (let i = writings.length - 1; i >= 0; i--) {
    const date = new Date(writings[i].created)
    console.log(date, currentDate.getDate())
    if (date.getDate() !== currentDate.getDate()) {
      break;
    }
    const wordCount = getWordCountFromMarkdown(writings[i].text)
    console.log(`${i}: ${wordCount} ${date.getDate()}`)
    if (wordCount < goal) {
      break;
    }
    streak += 1
    currentDate = new Date(date.getTime()  - 60 * 1000 * 60 * 24)
  }

  return streak
}
