import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import SpriteText from 'three-spritetext'
import { GraphData, buildGraphDataFromTransactions } from '../utils/utils'
import ReactLoading from 'react-loading'
import { useQuery, gql } from '@apollo/client'
import client from '../apolloClient'
import { RpcProvider } from 'starknet'
import LeaderboardModal from './LeaderboardModal'
const GET_AGGREGATED_TRANSACTIONS_FROM = gql`
    query AggregatedTransactionsFrom($param: String!) {
        mostPositive: aggregatedtransactions(
            where: { id_contains: $param }
            orderBy: absVolume
            first: 15
        ) {
            id
            from
            to
            value
            absVolume
        }
    }
`

interface TransactionsGraphProps {
    addressOrName: string
    graphData: GraphData
    setGraphData: React.Dispatch<React.SetStateAction<GraphData>>
    resetToggle: boolean
}

async function getAddress(
    addressOrName: string,
    provider: any
): Promise<string> {
    if (addressOrName.endsWith('.stark')) {
        // starkname was provided directly
        const starkName = addressOrName.toLowerCase()

        const address = await provider.getAddressFromStarkName(starkName)
        return address.toLowerCase()
    } else {
        // A StarkName was provided, get its associated address

        return addressOrName.toLowerCase()
    }
}

export function TransactionsGraph({
    addressOrName,
    graphData,
    setGraphData,
    resetToggle,
}: TransactionsGraphProps) {
    const DynamicGraph = dynamic(
        () => import('react-force-graph').then((mod) => mod.ForceGraph3D),
        { ssr: false }
    )

    const [isMounted, setIsMounted] = useState(false)
    const [rawData, setRawData] = useState({})
    const [modalVisible, setModalVisible] = useState(false)
    const [address, setAddress] = useState('')
    const provider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl: `https://starknet-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
            }),
        []
    )

    useEffect(() => {
        setIsMounted(true)
        const fetchAddr = async () => {
            let addr = await getAddress(addressOrName, provider)
            setAddress(addr)
        }
        fetchAddr()
    }, [addressOrName, provider])

    const addressBigInt = BigInt(address.toLowerCase())
    const param = addressBigInt.toString(16)
    const formattedAddress = `0x${param}`
    const { loading, error, data } = useQuery(
        GET_AGGREGATED_TRANSACTIONS_FROM,
        {
            client,
            variables: { param },
        }
    )

    useEffect(() => {
        if (data) {
            const { mostPositive } = data
            setRawData(mostPositive)
            console.log('sorted', mostPositive)
            const fetchGraphData = async () => {
                const graph = await buildGraphDataFromTransactions(
                    mostPositive,
                    formattedAddress,
                    provider
                )
                setGraphData(graph)
                console.log('graph', graph)
            }

            fetchGraphData()
        }
    }, [data, formattedAddress, setGraphData, provider, resetToggle])

    if (error) return <p>Error: {error.message}</p>

    const toggleModal = () => {
        setModalVisible(!modalVisible)
    }

    return (
        <>
            {isMounted &&
                (loading ? (
                    <div className="flex flex-col items-center justify-center">
                        <ReactLoading
                            className=""
                            type="spin"
                            color="#000"
                            height={50}
                            width={50}
                        />
                        <p className="">Looking for transactions...</p>
                    </div>
                ) : (
                    // Render your graph or other components here
                    <div className="flex flex-col items-start">
                        <button
                            className="h-12 rounded-xl bg-slate-400 hover:bg-slate-500 py-3 px-5 text-white transition-all focus:outline-none mb-4 absolute left-0 bottom-0 z-10 ml-16"
                            onClick={toggleModal}
                        >
                            Leaderboard
                        </button>

                        {/* Add the LeaderboardModal component and pass the data */}
                        <LeaderboardModal
                            visible={modalVisible}
                            onClose={toggleModal}
                            data={rawData}
                        />
                        <DynamicGraph
                            linkDirectionalParticles={2}
                            graphData={graphData}
                            nodeLabel="id"
                            nodeAutoColorBy="group"
                            onNodeDragEnd={(node) => {
                                node.fx = node.x
                                node.fy = node.y
                                node.fz = node.z
                            }}
                            nodeRelSize={3}
                            nodeOpacity={0.8}
                            nodeResolution={16}
                            backgroundColor="white"
                            linkWidth={1}
                            linkAutoColorBy="group"
                            linkCurvature={0}
                            linkVisibility={true}
                            linkDirectionalArrowLength={3.5}
                            linkDirectionalArrowRelPos={1}
                            linkLabel="value"
                            linkThreeObjectExtend={true}
                            linkThreeObject={(link: any) => {
                                // extend link with text sprite
                                const sprite = new SpriteText(`Ξ${link.value}`)
                                sprite.color = 'grey'
                                sprite.textHeight = 1.5
                                return sprite
                            }}
                            linkPositionUpdate={(sprite, { start, end }) => {
                                const middlePos = Object.assign(
                                    {},
                                    ...['x', 'y', 'z'].map((c) => ({
                                        [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
                                    }))
                                )

                                // Position sprite
                                Object.assign(sprite.position, middlePos)
                            }}
                            nodeThreeObject={(node: any) => {
                                const sprite =
                                    node.starknetId != ''
                                        ? new SpriteText(node.starknetId)
                                        : new SpriteText(
                                              node.id.substring(0, 12)
                                          )
                                sprite.color = 'black'
                                sprite.textHeight = 1.5
                                sprite.fontWeight = 'bold'
                                return sprite
                            }}
                            nodeThreeObjectExtend={true}
                        />
                    </div>
                ))}
        </>
    )
}
