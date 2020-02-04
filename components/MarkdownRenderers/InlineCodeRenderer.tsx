import React from 'react'

const InlineCodeRenderer: React.FC = ({ children }) => {
  return (
    <code className="bg-gray-300 p-1 text-sm rounded-sm">{children}</code>
  )
}

export default InlineCodeRenderer