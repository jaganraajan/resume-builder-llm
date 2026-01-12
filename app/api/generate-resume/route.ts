import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { llamaModel } from '@/lib/llm';

export const maxDuration = 60; // 60 seconds for tailoring

export async function POST(req: Request) {
    try {
        const { jobDescription, experiences, projects, summary } = await req.json();

        if (!jobDescription) {
            return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }

        const prompt = `
        You are an expert Resume Writer and Career Coach. 
        Your task is to tailor a candidate's resume to a specific job description.

        JOB DESCRIPTION:
        ${jobDescription}

        CANDIDATE DATA:
        SUMMARY: ${summary}
        EXPERIENCES: ${JSON.stringify(experiences)}
        PROJECTS: ${JSON.stringify(projects)}

        TASKS:
        1. Rewrite the PROFESSIONAL SUMMARY to be highly relevant to the job, highlighting key matches. (Keep it under 3-4 sentences).
        2. Rewrite the bullet points for each experience and project.
        3. Focus on using keywords from the job description.
        4. Maintain a professional, ATS-friendly tone.
        5. DO NOT change the company names, titles, or dates.
        6. Return the data in the EXACT same JSON format as the input.

        Format your response as a JSON object with:
        {
          "summary": "new tailored summary",
          "experiences": [...same structure with updated description arrays],
          "projects": [...same structure with updated description arrays]
        }
        Do not include any other text in your response, only the raw JSON.
        `;

        /*
        const { text } = await generateText({
            model: llamaModel,
            prompt: prompt,
        });

        // Try to parse the LLM response as JSON
        try {
            // Find the first { and last } to handle any potential conversational wrapping
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);
            const tailoredData = JSON.parse(jsonString);

            return NextResponse.json({
                success: true,
                ...tailoredData
            });
        } catch (parseError) {
            console.error('Failed to parse LLM response as JSON:', text);
            throw new Error('LLM failed to generate valid JSON data');
        }
        */

        // Return provided data as mock tailored data
        return NextResponse.json({
            success: true,
            experiences,
            projects,
            summary
        });

    } catch (error: any) {
        console.error('Error generating tailored resume:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate resume' }, { status: 500 });
    }
}
