// https://starknet-mainnet.infura.io/v3/

// hook to fetch data from an API

import { useState, useEffect } from 'react';

export default function useData(url : string) {

    const [data, setData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

        const response = await fetch(url);

        const json = await response.json();

        setData(json);

        };

        fetchData();

    }, [url]);

    return data;

}
