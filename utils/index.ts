import removeMd from 'remove-markdown'
import moment from 'moment'
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
  const today = moment()
  return today.isSame(someDate, 'day')
}

export const getDaysInRow = (writings: DailyWriting[], goal: number) => {
  let streak = 0
  let currentDate = moment()
  if (writings.length === 0) {
    return streak
  }

  for (let i = writings.length - 1; i >= 0; i--) {
    const date = moment(writings[i].created)
    if (date.date() !== currentDate.date()) {
      break;
    }
    const wordCount = getWordCountFromMarkdown(writings[i].text)
    if (wordCount < goal) {
      break;
    }
    streak += 1
    currentDate = currentDate.add(-1, 'days');
  }

  return streak
}
