import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import uuid from 'uuid/v4'
import { NextPage } from 'next'

import Layout from '../components/Layout'
// import Editor from '../components/Editor'
import Link from '../components/Link'
import renderers from '../components/MarkdownRenderers'
import { useLiveWordCount, useAutoSaveOnEdit } from '../hooks'
import { formatDate, isToday } from '../utils';
import { DailyWriting, WritingSettings } from '../types'
import { postWriting, patchWriting, getWritingSettings, getWriting, patchWritingSettings } from '../api'

const Editor = dynamic(() => {
  return import('../components/Editor')
}, { ssr: false })

const IndexPage: NextPage = () => {
  const [, setWrittingSettings] = useState<WritingSettings>()
  const [dailyWriting, setDailyWriting] = useState<DailyWriting>({ id: uuid() ,text: '', dateCreated: Date.now() })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)

  useEffect(() => {
    const init = async () => {
      let settings: WritingSettings = {'activeWritingId': ''};
      try {
        settings = await getWritingSettings()
        setWrittingSettings(settings)
      } catch (error) {
        console.error('settings not found:', error)
      }

      let gotWritingForToday = true
      try {
        const writing = await getWriting(settings.activeWritingId)
        if (!isToday(writing.dateCreated)) {
          throw new Error('writing not from today')
        }
        setDailyWriting(writing)
      } catch (error) {
        console.error(error)
        gotWritingForToday = false
      }

      if (!gotWritingForToday) {
        try {
          const postedWriting: DailyWriting = await postWriting(dailyWriting)
          setDailyWriting(postedWriting)
          const updatedSettings = {...settings, activeWritingId: postedWriting.id}
          const newSettings = await patchWritingSettings(updatedSettings)
          setWrittingSettings(newSettings)
        } catch (error) {
          console.error('failed to create writing', error)
        }
      }
    }

    init()
  }, [])

  const saveWriting = () => {
    patchWriting(dailyWriting)
    .catch(reason => console.error(`error saving writing ${reason}`))
  }

  const wordCount = useLiveWordCount(dailyWriting.text)
  const { saved, editValue } = useAutoSaveOnEdit(setDailyWriting, saveWriting)

  return (
    <Layout title="Home | Write More">
      <div className="max-w-2xl mx-auto p-4">
        <nav className="mb-20">
          <p className="font-semibold text-lg">Write More</p>
        </nav>
        <main className="mb-6">
          <div className="flex flex-col items-start mb-4 md:flex-row md:items-center md:justify-between">
            <h1 className="mb-2 font-bold text-2xl text-green-500 md:text-3xl md:mb-0">{formatDate(dailyWriting.dateCreated)}</h1>
            <button
              onClick={togglePreviewMode}
              className="px-4 py-1 text-green-500 border-green-500 border rounded-lg font-semibold hover:text-white hover:bg-green-400"
            >
              {isPreviewMode ? "Editor" : "Preview"}
            </button>            
          </div>
          {
            !isPreviewMode ?
            <Editor writing={dailyWriting} updateWriting={editValue} /> :
            <ReactMarkdown source={dailyWriting.text} renderers={renderers} />
          }
        </main>
        <footer className="flex justify-between items-center">
          <small>Built by <Link href="https://kyrelldixon.com">Kai</Link></small>
          {saved && <span className="text-green-500">Saved Successfully</span>}
          <span>Word Count: {wordCount}</span>
        </footer>
      </div>
    </Layout>
  )
}

export default IndexPage
