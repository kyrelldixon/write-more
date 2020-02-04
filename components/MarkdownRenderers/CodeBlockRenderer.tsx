import React from 'react'

type CodeBlockProps = {
  value: string
  language: string | null
}

const CodeBlockRenderer: React.FC<CodeBlockProps> = ({ value, ...rest }) => {
  console.log({...rest})
  return (
    <pre className="bg-gray-300 p-4 text-sm rounded-sm mb-6 overflow-x-auto">
      <code>
        {value}
      </code>
    </pre>
  )
}

export default CodeBlockRenderer
