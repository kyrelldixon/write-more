import React from 'react'

type Props = {
  children: React.ReactNode
  href: string
}

const BlockQuoteRenderer: React.FC<Props> = ({ children }) => {
  return (
    <blockquote className="text-xl font-semibold px-4 border-l-4">{children}</blockquote>
  )
}

export default BlockQuoteRenderer