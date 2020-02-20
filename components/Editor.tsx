import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

import { DailyWriting } from '../types'
import { createExtraKeys } from '../utils/codemirror';

import 'codemirror/mode/gfm/gfm'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/edit/continuelist'

// from https://github.com/taniarascia/takenote/blob/master/src/client/slices/settings.ts
const codeMirrorOptions = {
  mode: 'gfm',
  theme: 'default mirrormark',
  tabSize: 2,
  indentWithTabs: true,
  autoCloseBrackets: true,
  autoCloseTags: true,
  addModeClass: true,
  extraKeys: {
    "Enter": 'newlineAndIndentContinueMarkdownList',
    ...createExtraKeys(),
  },
  lineNumbers: false,
  lineWrapping: true,
  viewportMargin: Infinity,
  dragDrop: false,
  autoFocus: true,
  cursorHeight: 0.85,
  placeholder: 'Write anything...',
}

type Props = {
  writing: DailyWriting
  updateWriting: (writing: DailyWriting) => void
}

const Editor: React.FC<Props> = ({ writing, updateWriting }) => {
  return (
    <div className="text-xl md:text-lg">
      <CodeMirror
        options={codeMirrorOptions}
        value={writing.text}
        editorDidMount={editor => {
          setTimeout(() => {
            editor.focus()
          }, 0)
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