import React from 'react'

type Props = {
  children: React.ReactNode
}

type ListProps = {
  children: React.ReactNode
  ordered: number
}

const ListRenderer: React.FC<ListProps> = ({ children, ordered }) => {
  return ordered ?
    <Ol>{children}</Ol> :
    <Ul>{children}</Ul>
}

const Ol: React.FC<Props> = ({ children }) => <ol className="list-decimal mb-6">{children}</ol>
const Ul: React.FC<Props> = ({ children }) => <ul className="list-disc mb-6">{children}</ul>

export default ListRenderer