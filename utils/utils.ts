export interface GraphData {
    links: LinkObject[]
    nodes: object[]
}

export type NodeObject = object & {
    id?: string | number
    x?: number
    y?: number
    z?: number
    vx?: number
    vy?: number
    vz?: number
    fx?: number
    fy?: number
    fz?: number
}

export type LinkObject = object & {
    source?: string | number | NodeObject
    target?: string | number | NodeObject
    value?: number
}

export type Event = {
    block_hash: string
    block_number: number
    data: string[]
    from_address: string
    keys: string[]
    transaction_hash: string
}

export type AggregatedTx = {
    id: string
    from: string
    to: string
    value: number
    absVolume: number
}

export async function buildGraphDataFromTransactions(
    transactions: AggregatedTx[],
    address: string,
    provider: any
): Promise<GraphData> {
    const nodes: any[] = []
    const links: LinkObject[] = []

    const nodeIds = new Set<string>()
    nodes.push({ id: address, group: 1, color: 'red' })
    nodeIds.add(address)

    transactions.forEach((transaction) => {
        if (!nodeIds.has(transaction.from)) {
            nodes.push({ id: transaction.from, group: 1 })
            nodeIds.add(transaction.from)
        }

        if (!nodeIds.has(transaction.to)) {
            nodes.push({ id: transaction.to, group: 1 })
            nodeIds.add(transaction.to)
        }

        let from = transaction.from
        let to = transaction.to
        let source = transaction.value > 0 ? to : from
        let target = transaction.value > 0 ? from : to
        // Check if the input address is equal to the transaction.to and the value is negative
        // if (address === to) {
        //     source = transaction.value < 0 ? from : to
        //     target = transaction.value < 0 ? to : from
        // }

        const link = {
            source: source,
            target: target,
            value: transaction.absVolume,
        }

        links.push(link)
    })
    nodes.forEach(async (element: any) => {
        try {
            await provider.getStarkName(element.id).then((res) => {
                element.starknetId = res
            })
        } catch (error) {
            element.starknetId = ''
        }
    })

    await Promise.all(
        nodes.map(async (node: any) => {
            try {
                const starknetId = await provider.getStarkName(node.id)
                node.starknetId = starknetId
            } catch (error) {
                node.starknetId = ''
            }
        })
    )
    return { nodes, links }
}
