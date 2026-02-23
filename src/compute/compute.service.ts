import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { createZGComputeNetworkBroker } from '@0glabs/0g-serving-broker';

@Injectable()
export class ComputeService implements OnModuleInit {
    private readonly logger = new Logger(ComputeService.name);
    private broker: any;
    private providerAddress: string;

    constructor(private readonly configService: ConfigService) {
        this.providerAddress = this.configService.get<string>('contract.provider.address')!;
    }

    async onModuleInit() {
        const rpcUrl = this.configService.get<string>('contract.network.rpcUrl'); // https://evmrpc-testnet.0g.ai
        const privateKey = this.configService.get<string>('contract.wallet.privateKey')!;

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(privateKey, provider);

        this.broker = await createZGComputeNetworkBroker(wallet);

        await this.broker.inference.acknowledgeProviderSigner(this.providerAddress);

        this.logger.log(`ComputeService initialized with provider address: ${this.providerAddress}`);
    }

    async summarize(fileContent: string, fileName: string): Promise<string> {
        const { endpoint, model } = await this.broker.inference.getServiceMetadata(
            this.providerAddress
        );


        const messages = [
            {
                role: 'system',
                content: 'You are a research assistant. Summarize the document concisely.'
            },
            {
                role: 'user',
                content: `Summarize this document titled "${fileName}":\n\n${fileContent}`
            }
        ];

        const headers = await this.broker.inference.getRequestHeaders(this.providerAddress);

        const response = await fetch(`${endpoint}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...headers },
            body: JSON.stringify({ model, messages })
        });

        const data = await response.json();

        const chatID = response.headers.get('ZG-Res-Key') || response.headers.get('zg-res-key');
        await this.broker.inference.processResponse(
            this.providerAddress,
            chatID ?? undefined,
            JSON.stringify(data.usage)
        );

    console.log('Compute response data:', JSON.stringify(data, null, 2))

        return data.choices[0].message.content;
    }
}