import React from 'react'
import { AppProps } from 'next/app'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'
import '../styles/index.css'
import '../styles/codemirror.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp
