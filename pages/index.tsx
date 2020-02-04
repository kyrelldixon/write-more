import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { NextPage } from 'next'
import { Controlled as CodeMirror } from 'react-codemirror2'

import Layout from '../components/Layout'
import renderers from '../components/MarkdownRenderers'
import { styleGuideText } from '../constants'

/* 
  dynamically import codemirror only on client
  since it looks for 'navigator' to render which
  is only in the browser
*/
dynamic(() => {
  return import('codemirror/mode/gfm/gfm')
}, { ssr: false })

// from https://github.com/taniarascia/takenote/blob/master/src/client/slices/settings.ts
const codeMirrorOptions = {
  mode: 'gfm',
  theme: 'base16-light',
  lineNumbers: false,
  lineWrapping: true,
  viewportMargin: Infinity,
  keyMap: 'default',
  dragDrop: false,
}

const IndexPage: NextPage = () => {
  const [text, setText] = useState(styleGuideText)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)
  const formatDate = () => {
    const today = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

    return today.toLocaleDateString("en-US", options)
  }

  return (
    <Layout title="Home | Write More">
      <div className="max-w-2xl mx-auto p-4">
        <nav className="mb-20">
          <p className="font-semibold text-lg">Write More</p>
        </nav>
        <main>
          <div className="flex flex-col items-start mb-4 md:flex-row md:items-center md:justify-between">
            <h1 className="mb-2 font-bold text-2xl text-green-500 md:text-3xl md:mb-0">{formatDate()}</h1>
            <button
              onClick={togglePreviewMode}
              className="px-4 py-1 text-green-500 border-green-500 border rounded-lg font-semibold hover:text-white hover:bg-green-400"
            >
              {isPreviewMode ? "Editor" : "Preview"}
            </button>
          </div>
          {
            isPreviewMode ? 
            <CodeMirror
            options={codeMirrorOptions}
            value={text}
            editorDidMount={editor => {
              setTimeout(() => {
                editor.focus()
              }, 0)
              editor.setCursor(0)
            }}
            onBeforeChange={(_editor, _data, value) => {
              setText(value)
            }}
            /> :
            <ReactMarkdown source={text} renderers={renderers} />
          }
        </main>
        <footer className="flex justify-end">Word Count: 0</footer>
      </div>
    </Layout>
  )
}

export default IndexPage
