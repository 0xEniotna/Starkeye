import type { NextPage } from 'next'
import Main from '../components/main'
const Home: NextPage = () => {
    return (
        <div className="flex max-h-screen flex-col items-center justify-center py-2">
            <Main />
        </div>
    )
}

export default Home
