import CodeMirror from 'codemirror'
import { Action, ExtraKeys, KeyMap } from '../types';

/**
 * Insert a string at cursor position
 * @param  cm CodeMirror Instance
 * @param  {String} insertion
 */
const insert = (cm: any, insertion: string) => {
  var doc = cm.getDoc();
  var cursor = doc.getCursor();

  doc.replaceRange(insertion, { line: cursor.line, ch: cursor.ch });
}

/**
 * Toggle a string at the start and end of a selection
 * @param  cm CodeMirror Instance
 * @param  {String} start Start string to wrap
 * @param  {String} end  End string to wrap
 */
function toggleAround(cm: any, start: string, end: string) {
  var doc = cm.getDoc();
  var cursor = doc.getCursor();

  if (doc.somethingSelected()) {
    var selection = doc.getSelection();
    if (selection.startsWith(start) && selection.endsWith(end)) {
      doc.replaceSelection(selection.substring(start.length, selection.length - end.length), "around");
    } else {
      doc.replaceSelection(start + selection + end, "around");
    }
  } else {
    // If no selection then insert start and end args and set cursor position between the two.
    doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
    doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length })
  }
}

/**
 * Toggle a string before a selection
 * @param  cm CodeMirror Instance
 * @param {String} insertion	String to insert
 */
function toggleBefore(cm: any, insertion: string) {
  var doc = cm.getDoc();
  var cursor = doc.getCursor();

  if (doc.somethingSelected()) {
    var selections = doc.listSelections();
    var remove = false;
    cm.operation(() => {
      selections.forEach((selection: any) => {
        var pos = [selection.head.line, selection.anchor.line].sort();

        // Remove if the first text starts with it
        if (!remove) {
          remove = doc.getLine(pos[0]).startsWith(insertion);
        }

        for (var i = pos[0]; i <= pos[1]; i++) {
          if (remove) {
            // Don't remove if we don't start with it
            if (doc.getLine(i).startsWith(insertion)) {
              doc.replaceRange("", { line: i, ch: 0 }, { line: i, ch: insertion.length });
            }
          } else {
            doc.replaceRange(insertion, { line: i, ch: 0 });
          }
        }
      });
    });
  } else {
    var line = cursor.line;
    if (doc.getLine(line).startsWith(insertion)) {
      doc.replaceRange("", { line: line, ch: 0 }, { line: line, ch: insertion.length });
    } else {
      doc.replaceRange(insertion, { line: line, ch: 0 });
    }

  }
}

export const keyMap: KeyMap = {
  "Cmd-B": 'bold',
  "Cmd-I": 'italicize',
  "Cmd-'": 'blockquote',
  "Cmd-Alt-L": 'orderedList',
  "Cmd-L": 'unorderedList',
  "Cmd-Alt-I": 'image',
  "Cmd-H": 'hr',
  "Cmd-K": 'link',
}

export const actions: Action = {
  bold: (cm: any) => {
    toggleAround(cm, '**', '**')
  },
  italicize: (cm: any) => {
    toggleAround(cm, '*', '*')
  },
  strikethrough: (cm: any) => {
    toggleAround(cm, '~~', '~~')
  },
  code: (cm: any) => {
    toggleAround(cm, '```\r\n', '\r\n```')
  },
  blockquote: (cm: any) => {
    toggleBefore(cm, '> ')
  },
  orderedList: (cm: any) => {
    toggleBefore(cm, '1. ')
  },
  unorderedList: (cm: any) => {
    toggleBefore(cm, '* ')
  },
  image: (cm: any) => {
    toggleAround(cm, '![', '](https://)')
  },
  link: (cm: any) => {
    toggleAround(cm, '[', '](https://)')
  },
  hr: (cm: any) => {
    insert(cm, '---')
  },
}

export const createExtraKeys = () => {
  let extraKeys: ExtraKeys = {}
  for (let [hotKey, action] of Object.entries(keyMap)) {
    // Fix shortcuts for devices that aren't mac
    // @ts-ignore
    let realHotKey: string = hotKey.replace("Cmd-", (CodeMirror.keyMap["default"] === CodeMirror.keyMap.macDefault) ? "Cmd-" : "Ctrl-")
    extraKeys[hotKey] = actions[action]
  }

  return extraKeys
}