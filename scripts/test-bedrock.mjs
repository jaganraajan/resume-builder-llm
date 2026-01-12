import { generateText } from 'ai';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

// Load environment variables if not already loaded (for standalone execution)
import 'dotenv/config';

async function main() {
    console.log('Testing Bedrock Llama 3 70B...');

    try {
        // Note: Standard AWS Bedrock uses AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
        // However, if you are using the new AWS Bedrock API Key (Bearer Token), 
        // or a proxy that uses BEDROCK_API_KEY, we map it here.

        const bedrock = createAmazonBedrock({
            region: process.env.AWS_REGION || 'us-east-1',
            apiKey: process.env.AWS_BEARER_TOKEN_BEDROCK,
        });

        const { text } = await generateText({
            model: bedrock('meta.llama3-70b-instruct-v1:0'),
            prompt: 'Hello! Tell me about Jagan Raajan',
        });

        console.log('\nResponse from Bedrock:');
        console.log('---');
        console.log(text);
        console.log('---');

    } catch (error) {
        console.error('\nError connecting to Bedrock:');
        console.error(error.message);
        if (error.message.includes('401')) {
            console.log('\nTip: Check if BEDROCK_API_KEY is correct and if you need standard AWS credentials.');
        }
    }
}

main();
