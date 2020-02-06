import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { NextPage } from 'next'

import Layout from '../components/Layout'
import Editor from '../components/Editor'
import Link from '../components/Link'
import renderers from '../components/MarkdownRenderers'
import { useLiveWordCount } from '../hooks'
import { formatDate } from '../utils';
import { DailyWriting } from '../types'
import { getWriting, postWriting } from '../api'

const IndexPage: NextPage = () => {
  const [dailyWriting, setDailyWriting] = useState<DailyWriting>({ id: '1' ,text: '', dateCreated: Date.now() })
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const togglePreviewMode = () => setIsPreviewMode(!isPreviewMode)

  useEffect(() => {
    const getWritingOrCreateIfNotFound = async (id: string) => {
      let fetched = true
      try {
        const writing = await getWriting(id)
        setDailyWriting(writing)
      } catch (error) {
        fetched = false
        console.error(`Failed to get writing: ${error}`)
      }

      if (!fetched) {
        try {
          const writing = await postWriting(dailyWriting)
          setDailyWriting(writing)
        } catch (error) {
          console.error(`Failed to create: ${error}`)
        }
      }
    }

    getWritingOrCreateIfNotFound('1')
  }, [])

  const wordCount = useLiveWordCount(dailyWriting.text)

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
