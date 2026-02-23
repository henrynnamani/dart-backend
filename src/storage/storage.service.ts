import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZgFile, Indexer, Batcher, KvClient } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private indexer: Indexer;
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private rpcUrl: string

  constructor(private configService: ConfigService) {
     const networkRpcUrl = this.configService.get<string>('contract.network.rpcUrl')!;
    const indexerRpc = this.configService.get<string>('contract.network.indexerRpc')!;
    const privateKey = this.configService.get<string>('contract.wallet.privateKey')!;


    this.provider = new ethers.JsonRpcProvider(networkRpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    this.indexer = new Indexer(indexerRpc);
    this.rpcUrl = networkRpcUrl;
  }

  async  uploadFile(filePath) {
      const file = await ZgFile.fromFilePath(filePath);

      const [tree, treeErr] = await file.merkleTree();
      if (treeErr !== null) {
        throw new Error(`Error generating Merkle tree: ${treeErr}`);
      }
    
      console.log("File Root Hash:", tree?.rootHash());
    
      const [tx, uploadErr] = await this.indexer.upload(file, this.rpcUrl, this.signer);
    
      await file.close();
    
      return { rootHash: tree?.rootHash(), txHash: tx };
  }
}