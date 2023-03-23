import type { NextPage } from 'next'
import Head from 'next/head'
import Main from '../components/main'

const Home: NextPage = () => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://kit.fontawesome.com/c034175ff7.js" crossOrigin="anonymous"></script>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet"/>

      </Head>

      <Main />
      
    </div>
  )
}

export default Home
