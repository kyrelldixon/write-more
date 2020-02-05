import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

// from https://github.com/taniarascia/takenote/blob/master/src/client/slices/settings.ts
const codeMirrorOptions = {
  mode: 'gfm',
  lineNumbers: false,
  lineWrapping: true,
  viewportMargin: Infinity,
  keyMap: 'default',
  dragDrop: false,
}

type Props = {
  text: string
  setText: (text: string) => void
}

const Editor: React.FC<Props> = ({ text, setText }) => {
  return (
    <div className="text-lg">
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
    </div>
  )
}

export default Editor