import React, { useState } from 'react'
import { GraphData } from '../utils/utils'
import { TransactionsGraph } from './graph'
import { HiMagnifyingGlass } from 'react-icons/hi2'

const emptyGraphData: GraphData = {
    nodes: [],
    links: [],
}

export default function Main() {
    const [graphData, setGraphData] = useState<GraphData>({
        nodes: [],
        links: [],
    })
    const [target, setTarget] = useState<string>(
        '0x7c57808b9cea7130c44aab2f8ca6147b04408943b48c6d8c3c83eb8cfdd8c0b'
    )
    const [searchAddress, setSearchAddress] = useState<string>(
        '0x7c57808b9cea7130c44aab2f8ca6147b04408943b48c6d8c3c83eb8cfdd8c0b'
    )
    const [resetToggle, setResetToggle] = useState(false)

    const resetGraph = () => {
        setResetToggle(!resetToggle)

        handleSearchClick()
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTarget(event.target.value)
    }

    function handleSearchClick() {
        setSearchAddress(target)
    }

    return (
        <div className="">
            <div className="z-40 bg-white bg-opacity-0 py-8 w-3/4 md:w-1/2 m-auto absolute top-0 left-0 transform mt-12 rounded-lg">
                <h1
                    className="text-center font-bold text-4xl mb-4 flex flex-row items-center justify-center"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                    <HiMagnifyingGlass />
                    <span style={{ fontFamily: "'Roboto Mono', monospace" }}>
                        {' '}
                        StarkEye
                    </span>
                </h1>
                <div className="flex flex-col items-center w-4/5 m-auto mt-4 relative">
                    <input
                        className="h-12 text-center border-b-2 border-gray-300  w-full overflow-visible focus:outline-none focus:border-slate-400 transition-all"
                        placeholder="address"
                        onChange={handleInputChange}
                    ></input>
                    <div className="flex flex-row pt-5 justify-evenly w-full mt-4">
                        <button
                            className="h-12 rounded-xl bg-slate-400 hover:bg-slate-500 py-3 px-5 text-white transition-all focus:outline-none"
                            onClick={handleSearchClick}
                        >
                            Search
                        </button>
                        <button
                            className="h-12 rounded-xl bg-slate-400 hover:bg-slate-500 py-3 px-5 text-white transition-all focus:outline-none"
                            onClick={resetGraph}
                        >
                            Reset Graph
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 m-4 z-40">
                <a href="https://github.com/0xEniotna/Starky" target="_blank">
                    <svg
                        height="32"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="32"
                        aria-hidden="true"
                    >
                        <path
                            fill="#000000"
                            fillRule="evenodd"
                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.37-.95-.91-1.2-.91-1.2-.74-.5.06-.49.06-.49.82.06 1.25.85 1.25.85.73 1.25 1.91.9 2.37.69.07-.53.28-.9.51-1.1-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8.014 8.014 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                        ></path>
                    </svg>
                </a>
            </div>
            <div className="h-screen w-full flex items-center justify-center">
                <TransactionsGraph
                    address={searchAddress}
                    graphData={graphData}
                    setGraphData={setGraphData}
                    resetToggle={resetToggle}
                />
            </div>
        </div>
    )
}
