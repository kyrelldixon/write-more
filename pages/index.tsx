import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { NextPage } from 'next'

import Layout from '../components/Layout'
import Editor from '../components/Editor'
import Link from '../components/Link'
import renderers from '../components/MarkdownRenderers'
import { useLiveWordCount, useInterval } from '../hooks'
import { formatDate } from '../utils';
import { DailyWriting } from '../types'

const IndexPage: NextPage = () => {
  const [dailyWriting, setDailyWriting] = useState<DailyWriting>({ id: '1' ,text: '', dateCreated: Date.now() })
  const [writings, setWritings] = useState<DailyWriting[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const wordCount = useLiveWordCount(dailyWriting.text)
  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)

  const createWriting = () => {
    const writing = { id: '1' ,text: '', dateCreated: Date.now() }
    return writing
  }
  // get all writings
  const getWritingsFromLocalStorage = () => {
    const writings = localStorage.getItem('writings')
    if (!writings) {
      return []
    }
    return JSON.parse(writings)
  }
  // save writings to state on mount
  useEffect(() => {
    const writings = getWritingsFromLocalStorage()
    const todaysWriting = getTodaysWritingById('1')

    if (!todaysWriting) {
      const writing = createWriting()
      setWritings([...writings, writing])
    }
    
    setWritings(writings)
  }, [])
  // look for todays writing
  const getTodaysWritingById = (id: string) => {
    return writings.find(writing => writing.id === id)
  }
  // save all writings on interval
  const updateWritings = () => {
    const updated = writings.map(writing => {
      if (writing.id === dailyWriting.id) {
        return dailyWriting
      }
      return writing
    })
    setWritings(updated)
  }

  const saveWritingsToLocalStorage = (writings: DailyWriting[]) => {
    localStorage.setItem('writings', JSON.stringify(writings))
  }

  const syncWritings = () => {
    updateWritings()
    saveWritingsToLocalStorage(writings)
  }

  useInterval(syncWritings, 2000)

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
            <Editor writing={dailyWriting} updateWriting={setDailyWriting} /> :
            <ReactMarkdown source={dailyWriting.text} renderers={renderers} />
          }
        </main>
        <footer className="flex justify-between items-center">
          <small>Built by <Link href="https://kyrelldixon.com">Kai</Link></small>
          <span>Word Count: {wordCount}</span>
        </footer>
      </div>
    </Layout>
  )
}

export default IndexPage
