# StarkEye, address inspector for Starknet

This repo is a Next.js/Typescript project. It uses Apollo the query the indexer.  

It uses SnapshotLabs' [Checkpoint](https://docs.checkpoint.fyi/)

## How to use

```bash
git clone https://github.com/0xEniotna/Starkeye.git
```

```bash
yarn
```

Then you'll need to setup the indexer. Follow the steps here: [checkpoint_indexer](https://github.com/0xEniotna/checkpoint_starkeye). 

You need to create a .env file with the NEXT_PUBLIC_INDEXER_URL variable.

For local dev: `NEXT_PUBLIC_INDEXER_URL=http://localhost:3001`

Then:  

```bash
yarn dev
```
