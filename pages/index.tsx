import React from 'react'
import NextLink from 'next/link'

import Layout from '../components/Layout'

const IndexPage = () => {
  return (
    <Layout>
      <div className="flex flex-col mx-auto text-center h-full justify-center items-center px-2">
        <h1 className="text-3xl font-semibold mb-6">Build a writing habit and discover more about yourself</h1>
        <NextLink href="/app">
          <a className="bg-green-500 text-white px-4 py-2 rounded-lg uppercase font-semibold">Try it out</a>
        </NextLink>
      </div>
    </Layout>
  )
}

export default IndexPage