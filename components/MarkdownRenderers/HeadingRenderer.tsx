import * as React from 'react'

type Props = {
  children: React.ReactNode
}

type HeaderProps = {
  children: React.ReactNode
  level: number
}

const HeadingRenderer: React.FC<HeaderProps> = ({ level, children }) => {
  console.log(level)
  let Component = H1
  switch (level) {
    case 1:
      Component = H1
      break
    case 2:
      Component = H2
      break
    case 3:
      Component = H3
      break
    case 4:
      Component = H4
      break
    case 5:
      Component = H5
      break
    case 6:
      Component = H6
      break
  }
  return (
   <Component>{children}</Component>
  )
}

const H1: React.FC<Props> = ({ children }) => {
  return <h1 className="text-3xl mb-6">{children}</h1>
}
const H2: React.FC<Props> = ({ children }) => {
  return <h2 className="text-2xl mb-6">{children}</h2>
}
const H3: React.FC<Props> = ({ children }) => {
  return <h3 className="text-xl mb-6">{children}</h3>
}
const H4: React.FC<Props> = ({ children }) => {
  return <h4 className="text-lg mb-6">{children}</h4>
}
const H5: React.FC<Props> = ({ children }) => {
  return <h5 className="mb-6">{children}</h5>
}
const H6: React.FC<Props> = ({ children }) => {
  return <h6 className="text-sm mb-6">{children}</h6>
}

export default HeadingRenderer