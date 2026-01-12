import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

/**
 * Shared Bedrock client configuration using Llama 3 70B
 */
export const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION || 'us-east-1',
    apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
});

export const llamaModel = bedrock('meta.llama3-70b-instruct-v1:0');
