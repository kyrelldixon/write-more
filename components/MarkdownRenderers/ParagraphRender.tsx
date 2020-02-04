import React from 'react'

type Props = {
  children: React.ReactNode
}

const ParagraphRenderer: React.FC<Props> = ({ children }) => {
  return (
    <p className="mb-6">{children}</p>
  )
}

export default ParagraphRenderer