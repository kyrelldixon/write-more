import React from 'react'

type LinkProps = {
  children: React.ReactNode
  href: string
}

const Link: React.FC<LinkProps> = ({ children, href }) => {
  return (
    <a
      href={href}
      className="text-blue-500"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

export default Link