import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_INDEXER_URL}`, // Replace with the URL of your GraphQL API
    cache: new InMemoryCache(),
})

export default client
