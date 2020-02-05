import removeMd from 'remove-markdown'

export const getWordCountFromMarkdown = (markdown: string) => {
  const plainText = removeMd(markdown)
  const trimmed = plainText.trim()
  const words = trimmed.replace(/['";:,.?¿\-!¡]+/g, '').match(/\S+/g) || []
  const wordCount = trimmed ? (words).length : 0
  return wordCount
}