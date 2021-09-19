import React from 'react'
import Head from 'next/head'
import MainWrapper from '../src/components/MainWrapper'
import { Theme } from '../src/utils/enums'

const Home: React.FC = () => {
  return (
    <MainWrapper themeName={Theme.gray} hasContent={false}>
      <Head>
        <title>Homepage</title>
      </Head>

      <main>
        <h1>Hello World!</h1>
      </main>
    </MainWrapper>
  )
}

export default Home
