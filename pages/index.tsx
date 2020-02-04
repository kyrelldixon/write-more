import * as React from 'react'
import Layout from '../components/Layout'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
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
            <button className="px-4 py-1 text-green-500 border-green-500 border rounded-lg font-semibold hover:text-white hover:bg-green-400">Preview</button>
          </div>
          <textarea className="w-full md:text-lg" rows={20} placeholder="Write more here" />
        </main>
        <footer className="flex justify-end">Word Count: 0</footer>
      </div>
    </Layout>
  )
}

export default IndexPage
