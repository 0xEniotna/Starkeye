import { useState, useEffect } from 'react';
import { RpcProvider } from 'starknet'
import { Event } from '../utils/utils';

type API_RESULT = {
    continuation_token: string,
    events: Event[]
}

export function useEvents(
    providerRPC: RpcProvider,
    targetAddress: string,
    address: string,
    fromBlockNumber: number,
    toBlockNumber: number,
    chunkSize: number
    ) {
    const [transferEvents, setTransferEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransferEvents = async () => {
            setLoading(true);
            const filteredEvents: Event[] = [];
            let continuationToken: string | undefined;
        
            try {
                do {
                const response = await providerRPC.getEvents({
                    address,
                    from_block: { block_number: fromBlockNumber },
                    to_block: { block_number: toBlockNumber },
                    chunk_size: chunkSize,
                    continuation_token: continuationToken,
                });
        
                continuationToken = response.continuation_token;
        
                const events = response.events;
        
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
        
                    if (
                    event.keys.includes(
                        '0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9'
                    ) &&
                    (event.data[1].toLowerCase() !=
                        '0x5dcd266a80b8a5f29f04d779c6b166b80150c24f2180a75e82427242dab20a9') 
                        &&
                    (event.data[0].toLowerCase() === targetAddress.toLowerCase() ||
                        event.data[1].toLowerCase() === targetAddress.toLowerCase())
                    )
                    {
                    filteredEvents.push(event);
                    }
                }
                } while (continuationToken);
        
                setTransferEvents(filteredEvents);
            } catch (error) {
                console.log(error);
            }
        
            setLoading(false);
        };

    fetchTransferEvents();
    }, [providerRPC, targetAddress, address, fromBlockNumber, toBlockNumber, chunkSize]);

    return { transferEvents, loading };
}

// const fetchRange = async (
//     providerRPC : RpcProvider,
//     targetAddress: string,
//     address: string,
//     fromBlockNumber: number,
//     toBlockNumber: number,
//     chunkSize: number,
// ) => {
//   const filteredEvents = [];
//   let continuationToken;

//   do {
//     const response : API_RESULT= await providerRPC.getEvents({
//       address,
//       from_block: { block_number: fromBlockNumber },
//       to_block: { block_number: toBlockNumber },
//       chunk_size: chunkSize,
//       continuation_token: continuationToken,
//     });

//     continuationToken = response.continuation_token;

//     const events = response.events.filter(
//       (event) =>
//         event.keys.includes('0x99cd8bde557814842a3121e8ddfd433a539b8c9f14bf31ebf108d12e6196e9') &&
//         (event.data[1].toLowerCase() === '0x5dcd266a80b8a5f29f04d779c6b166b80150c24f2180a75e82427242dab20a9') && 
//         (event.data[0].toLowerCase() === targetAddress.toLowerCase() ||
//           event.data[1].toLowerCase() === targetAddress.toLowerCase())
//     );

//     filteredEvents.push(...events);
//   } while (continuationToken);

//   return filteredEvents;
// };

// export function useEvents(
//   providerRPC : RpcProvider,
//   targetAddress: string,
//   address: string,
//   fromBlockNumber: number,
//   toBlockNumber: number,
//   chunkSize: number,
//   parallelTasks = 5) {
//   const [transferEvents, setTransferEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchTransferEvents = async () => {
//       setLoading(true);

//       const blockRange = Math.ceil((toBlockNumber - fromBlockNumber) / parallelTasks);
//       const tasks = [];

//       for (let i = 0; i < parallelTasks; i++) {
//         const startBlock = fromBlockNumber + i * blockRange;
//         const endBlock = Math.min(startBlock + blockRange, toBlockNumber);
//         tasks.push(
//           fetchRange(providerRPC, targetAddress, address, startBlock, endBlock, chunkSize)
//         );
//       }

//       const allResults = await Promise.all(tasks);
//       const filteredEvents = allResults.flat();

//       setTransferEvents(filteredEvents);
//       setLoading(false);
//     };

//     fetchTransferEvents();
//   }, [providerRPC, address, targetAddress, fromBlockNumber, toBlockNumber, chunkSize, parallelTasks]);

//   return { transferEvents, loading };
// }
