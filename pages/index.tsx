import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import { NextPage } from 'next'
import { Controlled as CodeMirror } from 'react-codemirror2'

import Layout from '../components/Layout'
import renderers from '../components/MarkdownRenderers'

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

const styleGuideText = `# Style Guide

## Headers

# H1

It is recommended to NOT use H1s as it is reserved for the article heading. Any H1 is set as an H2.

## H2

### H3

#### H4

##### H5

###### H6

## Emphasis

Emphasis, aka italics, with _asterisks_ or _underscores_.

Strong emphasis, aka bold, with **asterisks** or **underscores**.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

## Lists

1. First ordered list item
2. Another item
3. Actual numbers don't matter, just that it's a number

- Unordered list can use asterisks

* Or minuses

- Or pluses

## Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com

## Images

\`\`\`
# REMOVE IMAGE FROM CODE BLOCK TO DISPLAY
![alt text](https://source.unsplash.com/1600x900 "Random Image from unsplash.com")
\`\`\`

Lorem Ipsum is simply dummy text of \`the\` printing and typesetting \`industry\`. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry.

## Blockquotes

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing.

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum

## Code

### Inline

This is some \`inline code\` that is embedded in a sentence.

### Code Block

\`\`\`js
var React = require('react');
var Markdown = require('react-markdown');
React.render(
  <Markdown source="# Your markdown here" />,
  document.getElementById('content')
);
\`\`\`

## Horizontal Rule

Horizontal Rule

Three or more...

---

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.

It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum

---

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
`

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
