import React from 'react'

type Props = {
  children: React.ReactNode
}

const TableRenderer: React.FC<Props> = ({ children }) => {
  return (
    <table className="table-auto mb-6">{children}</table>
  )
}
const TableHeadRenderer: React.FC<Props> = ({ children }) => {
  return (
    <thead className="px-4 py-2">{children}</thead>
  )
}
const TableBodyRenderer: React.FC<Props> = ({ children }) => {
  return (
    <tbody className="px-4 py-2">{children}</tbody>
  )
}
const TableRowRenderer: React.FC<Props> = ({ children }) => {
  return (
    <tr className="border px-4 py-2 even:bg-gray-200">{children}</tr>
  )
}
const TableCellRenderer: React.FC<Props> = ({ children }) => {
  return (
    <td className="px-4 py-2">{children}</td>
  )
}

export default {
  table: TableRenderer,
  tableHead: TableHeadRenderer,
  tableBody: TableBodyRenderer,
  tableRow: TableRowRenderer,
  tableCell: TableCellRenderer,
}
