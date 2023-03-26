import type { NextPage } from 'next'
import Head from 'next/head'
import Main from '../components/main'
import Script from 'next/script'
const Home: NextPage = () => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>StarkEye</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap" rel="stylesheet"/>

      </Head>
      <Script src="https://kit.fontawesome.com/c034175ff7.js" crossOrigin="anonymous" />

      <Main />
      
    </div>
  )
}

export default Home
