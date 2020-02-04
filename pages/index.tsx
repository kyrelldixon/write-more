import React, { useState } from 'react'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { Controlled as CodeMirror } from 'react-codemirror2'

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

// from https://rexxars.github.io/react-markdown/
const initialState = `# Live demo

Changes are automatically rendered as you type.
## Table of Contents
* Implements [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual, "native" React DOM elements
* Allows you to escape or skip HTML (try toggling the checkboxes above)
* If you escape or skip the HTML, no \`dangerouslySetInnerHTML\` is used! Yay!
## HTML block below
<blockquote>
  This blockquote will change based on the HTML settings above.
</blockquote>
## How about some code?
\`\`\`js
var React = require('react');
var Markdown = require('react-markdown');
React.render(
  <Markdown source="# Your markdown here" />,
  document.getElementById('content')
);
\`\`\`
Pretty neat, eh?
## Tables?
| Feature   | Support |
| --------- | ------- |
| tables    | ✔ |
| alignment | ✔ |
| wewt      | ✔ |
## More info?
Read usage information and more on [GitHub](//github.com/rexxars/react-markdown)
---------------
A component by [Espen Hovlandsdal](https://espen.codes/)
`

const IndexPage: NextPage = () => {
  const [text, setText] = useState(initialState)
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
            <button className="px-4 py-1 text-green-500 border-green-500 border rounded-lg font-semibold hover:text-white hover:bg-green-400">Preview</button>
          </div>
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
          />
        </main>
        <footer className="flex justify-end">Word Count: 0</footer>
      </div>
    </Layout>
  )
}

export default IndexPage
