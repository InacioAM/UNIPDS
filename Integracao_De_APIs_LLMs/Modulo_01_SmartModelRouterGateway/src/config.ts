import { maxTokensUsed } from '@openrouter/sdk';
import 'dotenv/config'
import { spawn } from 'node:child_process';

console.assert(
    process.env.OPENROUTER_API_KEY,
    'OPENROUTER_API_KEY is not set in env file'
)

export type modelConfig = {
    apiKey: string;
    httpReference: string;
    xTitle: string;
    port: number;
    model: string[];
    temperature: number;
    maxTokens: number;
    systemPrompt: string;    
    stream: boolean;
    provider:{
        sort:{
            by: string;
            partition: string;
        }
    }
}

export const config = {
    apiKey: process.env.OPENROUTER_API_KEY!,
    httpReference: 'http://pos-ia.com',
    xTitle: 'Smart Model Router Gateway',
    port: 3000,
    model: [
        
        //'nvidia/nemotron-3.5-content-safety:free',
        'sourceful/riverflow-v2.5-fast',
        //'nvidia/nemotron-3-ultra-550b-a55b:free',
        'openrouter/owl-alpha',
        'nex-agi/nex-n2-pro:free',
    ],
    temperature: 0.2,
    maxTokens: 50,
    systemPrompt: 'you are a helpful assistant.',
    stream: false,
    provider: {
        sort: {
            by: 'price',
            partition: 'none'
        }
    }    
}