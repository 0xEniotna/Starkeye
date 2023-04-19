import React, { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import SpriteText from 'three-spritetext'
import { GraphData, buildGraphDataFromTransactions } from '../utils/utils'
import ReactLoading from 'react-loading'
import { useQuery, gql } from '@apollo/client'
import client from '../apolloClient'
import { RpcProvider } from 'starknet'

const GET_AGGREGATED_TRANSACTIONS_FROM = gql`
    query AggregatedTransactionsFrom($address: String!) {
        aggregatedtransactions(
            where: { from: $address }
            orderBy: value
            first: 10
        ) {
            id
            from
            to
            value
        }
    }
`

interface TransactionsGraphProps {
    address: string
    graphData: GraphData
    setGraphData: React.Dispatch<React.SetStateAction<GraphData>>
}

export function TransactionsGraph({
    address,
    graphData,
    setGraphData,
}: TransactionsGraphProps) {
    const DynamicGraph = dynamic(
        () => import('react-force-graph').then((mod) => mod.ForceGraph3D),
        { ssr: false }
    )
    const { loading, error, data } = useQuery(
        GET_AGGREGATED_TRANSACTIONS_FROM,
        {
            client,
            variables: { address },
        }
    )

    const provider = useMemo(
        () =>
            new RpcProvider({
                nodeUrl: `https://starknet-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
            }),
        []
    )

    useEffect(() => {
        if (data) {
            const { aggregatedtransactions } = data
            const graph = buildGraphDataFromTransactions(
                aggregatedtransactions,
                address,
                provider
            )

            setGraphData(graph)
        }
    }, [data, address, setGraphData])

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            {loading ? (
                <ReactLoading
                    className=""
                    type="spin"
                    color="#000"
                    height={50}
                    width={50}
                />
            ) : (
                // Render your graph or other components here
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
                                : new SpriteText(node.id.substring(0, 12))
                        sprite.color = 'black'
                        sprite.textHeight = 1.5
                        sprite.fontWeight = 'bold'
                        return sprite
                    }}
                    nodeThreeObjectExtend={true}
                />
            )}
        </>
    )
}
