import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import Head from 'next/head'
import Script from 'next/script'
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>StarkEye</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&display=swap"
                    rel="stylesheet"
                />
                <link
                    href="https://kit.fontawesome.com/c034175ff7.js"
                    rel="stylesheet"
                />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    )
}

export default MyApp
