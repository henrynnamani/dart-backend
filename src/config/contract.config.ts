import { registerAs } from "@nestjs/config";

export default registerAs('contract', () => ({
    network: {
        rpcUrl: process.env.RPC_URL,
        indexerRpc: process.env.INDEXER_RPC || 'https://indexer-storage-testnet-turbo.0g.ai',
        chainId: parseInt(process.env.CHAIN_ID!) || 16602,
      },
      wallet: {
        privateKey: process.env.PRIVATE_KEY,
      },
        address: process.env.CONTRACT_ADDRESS,
      server: {
        port: parseInt(process.env.PORT!) || 3000,
      },
      provider: {
        address: process.env.OG_PROVIDER_ADDRESS,
      }
}))