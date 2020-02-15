import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import uuid from 'uuid/v4'
import { NextPage } from 'next'

import Layout from '../components/Layout'
import Link from '../components/Link'
import renderers from '../components/MarkdownRenderers'
import { useLiveWordCount, useAutoSaveOnEdit } from '../hooks'
import { formatDate, isToday, getDaysInRow } from '../utils';
import { DailyWriting, WritingSettings } from '../types'
import { postWriting, patchWriting, getWritingSettings, getWriting, patchWritingSettings, getWritings } from '../api'

const Editor = dynamic(() => {
  return import('../components/Editor')
}, { ssr: false })

const IndexPage: NextPage = () => {
  const [writingsStreak, setWritingsStreak] = useState(0)
  const [writingSettings, setWrittingSettings] = useState<WritingSettings>({ activeWritingId: '', dailyGoal: 750 })
  const [dailyWriting, setDailyWriting] = useState<DailyWriting>({ id: uuid() ,text: '', created: Date.now() })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)

  useEffect(() => {
    console.log({date: new Date().toISOString()})
    const init = async () => {
      let settings: WritingSettings = writingSettings
      try {
        settings = await getWritingSettings()
        setWrittingSettings(settings)
      } catch (error) {
        console.error('settings not found:', error)
      }

      let gotWritingForToday = true
      try {
        const writing = await getWriting(settings.activeWritingId)
        if (!isToday(writing.created)) {
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

      const writings = await getWritings()
      const streak = getDaysInRow(writings, writingSettings.dailyGoal)
      setWritingsStreak(streak)
    }

    init()
  }, [])

  const saveWriting = () => {
    patchWriting(dailyWriting)
    .catch(reason => console.error(`error saving writing ${reason}`))
  }

  const wordCount = useLiveWordCount(dailyWriting.text)
  const { dailyGoal } = writingSettings
  const { saved, editValue } = useAutoSaveOnEdit(setDailyWriting, saveWriting)

  return (
    <Layout title="Home | Write More">
      <nav className="fixed z-10 w-screen p-4 bg-white border-b md:border-none">
        <div className="max-w-2xl flex justify-between items-end mx-auto">
          <p className="font-semibold text-lg">Write More</p>
          <div>
            <span className="mr-2">{writingsStreak} Day Streak</span>
            <span className={wordCount >= dailyGoal ? 'text-green-500' : ''}>
              <span className="font-semibold">{wordCount}</span> Words
            </span>
          </div>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto pt-32 p-4">
        <main className="mb-6">
          <div className="flex flex-col items-start mb-4 md:flex-row md:items-center md:justify-between">
            <h1 className="mb-4 font-bold text-3xl text-green-500 md:text-3xl md:mb-0">{formatDate(dailyWriting.created)}</h1>
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
        <footer className="flex justify-between items-end">
          <small>Built by <Link href="https://kyrelldixon.com">Kai</Link></small>
          <div className={`flex flex-col text-right ${wordCount >= dailyGoal ? 'text-green-500' : ''}`}>
            {saved && <span className="text-green-500">Saved Successfully</span>}
            <span><span className="font-semibold">{wordCount <= dailyGoal ? dailyGoal - wordCount : 0}</span> Words left</span>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default IndexPage
