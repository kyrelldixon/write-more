import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import ReactMarkdown from 'react-markdown'
import uuid from 'uuid/v4'
import { NextPage } from 'next'

import Layout from '../components/Layout'
import Link from '../components/Link'
import Gear from '../components/Gear'
import renderers from '../components/MarkdownRenderers'
import { useLiveWordCount, useAutoSaveOnEdit } from '../hooks'
import { formatDate, isToday, getDaysInRow } from '../utils';
import { DailyWriting, WritingSettings } from '../types'
import { postWriting, patchWriting, getWritingSettings, getWriting, patchWritingSettings, getWritings } from '../api'

const Editor = dynamic(() => {
  return import('../components/Editor')
}, { ssr: false })

const AppPage: NextPage = () => {
  const [writings, setWritings] = useState<DailyWriting[]>([])
  const [writingsStreak, setWritingsStreak] = useState(0)
  const [writingSettings, setWritingSettings] = useState<WritingSettings>({ activeWritingId: '', dailyGoal: 750 })
  const [dailyWriting, setDailyWriting] = useState<DailyWriting>({ id: uuid() ,text: '', created: new Date().toISOString() })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isGoalVisible, setIsGoalVisible] = useState(false)
  const [goal, setGoal] = useState(0)

  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)
  const toggleGoalVisibility = () => setIsGoalVisible(!isGoalVisible)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoal(+e.target.value)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    patchWritingSettings({...writingSettings, dailyGoal: goal})
    .then(settings => setWritingSettings(settings))
  }

  useEffect(() => {
    const init = async () => {
      let settings: WritingSettings = writingSettings
      try {
        settings = await getWritingSettings()
        setWritingSettings(settings)
      } catch (error) {
        console.error('settings not found:', error)
      }

      let gotWritingForToday = true
      try {
        let writing = await getWriting(settings.activeWritingId)
        // if it's the old writing, change it to the new one        
        if (writing.dateCreated) {
          const created = new Date(writing.dateCreated).toISOString()
          writing = {id: writing.id, created, text: writing.text}
        }
        if (!isToday(writing.created)) {
          gotWritingForToday = false
        }
        else if (isToday(writing.created)) {
          setDailyWriting(writing)
        }
      } catch (error) {
        console.error(error)
      }

      if (!gotWritingForToday) {
        try {
          const postedWriting: DailyWriting = await postWriting(dailyWriting)
          setDailyWriting(postedWriting)
          const updatedSettings = {...settings, activeWritingId: postedWriting.id}
          const newSettings = await patchWritingSettings(updatedSettings)
          setWritingSettings(newSettings)
        } catch (error) {
          console.error('failed to create writing', error)
        }
      }

      const writings = await getWritings()
      setWritings(writings)
    }

    init()
  }, [])

  const wordCount = useLiveWordCount(dailyWriting.text)

  useEffect(() => {
    const newWritings = writings.map(writing => writing.id === dailyWriting.id ? dailyWriting : writing)
    const streak = getDaysInRow(newWritings, writingSettings.dailyGoal)
    setWritings(newWritings)
    setWritingsStreak(streak)
  }, [wordCount, writingSettings])

  const saveWriting = () => {
    patchWriting(dailyWriting)
    .catch(reason => console.error(`error saving writing ${reason}`))
  }

  const { dailyGoal } = writingSettings
  const { saved, editValue } = useAutoSaveOnEdit(setDailyWriting, saveWriting)

  return (
    <Layout title="App | Write More">
      <nav className="fixed z-10 w-screen p-4 bg-white border-b md:border-none">
        <div className="max-w-2xl flex justify-between items-center mx-auto pb-2">
          <NextLink href="/">
            <a className="font-semibold text-lg">Write More</a>
          </NextLink>
          <div className={`flex items-center ${wordCount >= dailyGoal ? 'text-green-500' : ''}`}>
            <span className="mr-2">
              <span className="font-semibold">{writingsStreak}</span> Day Streak</span>
            <span>
              <span className="font-semibold">{wordCount}</span> Words
            </span>
          </div>
          <button onClick={toggleGoalVisibility}><Gear /></button>
        </div>
        {
          isGoalVisible &&
          (<form onSubmit={handleSubmit} className="flex justify-start items-center mx-auto max-w-2xl">
            <label className="mr-2">Word Count Goal:</label>
            <input
              className="p-1 border mr-2"
              type="tel"
              pattern="[0-9]*"
              placeholder="750"
              name="goal"
              value={goal}
              onChange={handleChange}
            />
            <button>Submit</button>
          </form>)
        }
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

export default AppPage
