import type { NextPage } from 'next'
import Head from 'next/head'
import Main from '../components/main'
import Script from 'next/script'
const Home: NextPage = () => {
    return (
        <div className="flex max-h-screen flex-col items-center justify-center py-2">
            <Main />
        </div>
    )
}

export default Home
