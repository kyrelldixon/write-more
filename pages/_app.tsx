import React from 'react'
import { AppProps } from 'next/app'

import '../styles/index.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/base16-light.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default MyApp
