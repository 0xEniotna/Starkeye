import React, { useEffect, useState, useMemo} from "react"
import dynamic from 'next/dynamic'
import SpriteText from 'three-spritetext';
import { mockData } from "../test_data/mockData";
import { GraphData, buildGraphDataFromTransactions, Event } from "../utils/utils";
import ReactLoading from 'react-loading';
import { useQuery, gql } from '@apollo/client';
import client from '../apolloClient';


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
`;

interface TransactionsGraphProps {
  address: string,
  graphData: GraphData;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
}

export function TransactionsGraph({address, graphData, setGraphData }: TransactionsGraphProps) {
  const DynamicGraph = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph3D), {
    ssr: false
  });
  const { loading, error, data } = useQuery(GET_AGGREGATED_TRANSACTIONS_FROM, {
    client,
    variables: { address },
  });

  if (error) return <p>Error: {error.message}</p>;

  // const graphData = useMemo(() => {
  //   if (data) {
  //     const { aggregatedtransactions } = data;
  //     console.log("data", data);
  //     return buildGraphDataFromTransactions(aggregatedtransactions, address);
  //   }
  //   return { nodes: [], links: [] };
  // }, [data]);
  useEffect(() => {
    if (data) {
      const { aggregatedtransactions } = data;
      console.log("data", data);
      setGraphData(buildGraphDataFromTransactions(aggregatedtransactions, address));
    }
  }, [data]);

  return (
    <>
      {loading ? (
              <ReactLoading className="" type="spin" color="#000" height={50} width={50} />
            ) : (
              // Render your graph or other components here
                <DynamicGraph
                  linkDirectionalParticles={2}
                  graphData={graphData}
                  nodeLabel="id"
                  nodeAutoColorBy="group"
                  onNodeDragEnd={node => {
                      node.fx = node.x;
                      node.fy = node.y;
                      node.fz = node.z;
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
                  nodeThreeObject={(node: any) => {
                    const sprite = new SpriteText(node.id.substring(0, 12));
                    sprite.color = 'black';
                    sprite.textHeight = 1.5;
                    return sprite;
                  }}
                  nodeThreeObjectExtend={true}                
              /> 
            )} 
    </>
  );
}

export default function Main () {
    
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });   
    
    const resetGraph = () => {
        setGraphData(mockData);
    };

    const [target, setTarget] = useState<string>('0x3ce2b9eaddadf58162eb6b43017955962305b39a8a4c45475ad2125ed08be1e');

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      setTarget(event.target.value);
    }
    function handleSearchClick() {
      // setAllEvents(events);
      console.log("Clicked")
    }
    
    return (
        <div className="">
            <div className="z-40 bg-opacity-100 py-10 w-1/2 m-auto absolute top-0 left-0">
                <h1 className="text-center font-bold text-4xl">{'STAR(s)KY'}</h1>
                <div className="flex flex-col w-2/3 m-auto mt-8 relative">
                    <input className="h-10 text-center border-b overflow-visible" placeholder="address"
                      onChange={handleInputChange}>
                    </input>
                    <div className="flex flex-row pt-5 justify-evenly">
                        <button className="h-10 rounded-xl bg-slate-400 py-3 px-5" onClick={handleSearchClick}>Search</button>
                        <button className="h-10 rounded-xl bg-slate-400 py-3 px-5" onClick={resetGraph}>Reset Graph</button>
                    </div>
                </div>
            </div>   
            <div className="absolute top-0 right-0 m-4 z-40">
                <a href="https://github.com/0xEniotna/Starky" target="_blank">
                    <svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true">
                    <path fill="#000000" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.37-.95-.91-1.2-.91-1.2-.74-.5.06-.49.06-.49.82.06 1.25.85 1.25.85.73 1.25 1.91.9 2.37.69.07-.53.28-.9.51-1.1-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.29.25.54.74.54 1.5v2.22c0 .21.14.46.55.38A8.014 8.014 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                </a>
            </div>
            <div className="h-screen w-full flex items-center justify-center">
              <TransactionsGraph address={target} graphData={graphData} setGraphData={setGraphData}/>
            </div>
        </div>            
    );
}
