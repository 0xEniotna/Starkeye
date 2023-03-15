import type { NextPage } from 'next'
import Head from 'next/head'
import Main from '../components/main'

const Home: NextPage = () => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main />
      
    </div>
  )
}

export default Home
