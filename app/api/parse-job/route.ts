import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { generateText } from 'ai';
import { llamaModel } from '@/lib/llm';

export const maxDuration = 30; // 30 seconds for LLM processing

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        console.log(`Parsing job from: ${url}`);

        // Fetch the page content
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other noise
        $('script, style, nav, footer, header').remove();
        const cleanText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000); // Token limit safety

        // Use LLM to extract structured data
        const { text } = await generateText({
            model: llamaModel,
            prompt: `
            You are an expert Job Description Parser. 
            Extract the following information from this job description text:
            1. Up to 15 key technical skills as a comma-separated list.
            2. A one-sentence summary of the role.
            3. The exact Job Title.

            Format your response exactly as:
            KEYWORDS: skill1, skill2, ...
            SUMMARY: role summary here
            TITLE: job title here

            Text: ${cleanText}`,
        });

        // Parse LLM response
        const keywordsMatch = text.match(/KEYWORDS:\s*(.*)/i);
        const summaryMatch = text.match(/SUMMARY:\s*(.*)/i);
        const titleMatch = text.match(/TITLE:\s*(.*)/i);

        const extractedKeywords = keywordsMatch ?
            keywordsMatch[1].split(',').map(s => s.trim()).filter(Boolean) :
            ['Teamwork', 'Communication'];

        const summary = summaryMatch ?
            summaryMatch[1].trim() :
            `Parsed job description from ${url}`;

        const jobTitle = titleMatch ?
            titleMatch[1].trim() :
            'Software Engineer';

        return NextResponse.json({
            success: true,
            extractedKeywords,
            summary,
            jobTitle,
            fullText: cleanText
        });

    } catch (error: any) {
        console.error('Error parsing job:', error);
        return NextResponse.json({ error: error.message || 'Failed to parse job' }, { status: 500 });
    }
}
