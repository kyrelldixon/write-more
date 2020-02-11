import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

import { DailyWriting } from '../types'

import 'codemirror/mode/gfm/gfm'

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
  writing: DailyWriting
  updateWriting: (writing: DailyWriting) => void
}

const Editor: React.FC<Props> = ({ writing, updateWriting }) => {
  return (
    <div className="text-lg">
      <CodeMirror
        options={codeMirrorOptions}
        value={writing.text}
        editorDidMount={editor => {
          setTimeout(() => {
            editor.focus()
          }, 0)
          editor.setCursor(0)
        }}
        onBeforeChange={(_editor, _data, value) => {
          updateWriting({
            ...writing,
            text: value,
          })
        }}
      /> 
    </div>
  )
}

export default Editor