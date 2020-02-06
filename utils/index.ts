import removeMd from 'remove-markdown'

export const getWordCountFromMarkdown = (markdown: string) => {
  const plainText = removeMd(markdown)
  const trimmed = plainText.trim()
  const words = trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []
  const wordCount = trimmed ? (words).length : 0
  return wordCount
}

export const formatDate = (utcDate: number, short = false) => {
  const date = new Date(utcDate)
  const options = 
    short ?
      {} :
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  
  return date.toLocaleDateString("en-US", options)
}
