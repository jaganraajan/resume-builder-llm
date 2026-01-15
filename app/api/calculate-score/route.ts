import { NextRequest, NextResponse } from 'next/server';
import { llamaModel } from '@/lib/llm';
import { generateText } from 'ai';

export async function POST(req: NextRequest) {
    try {
        const { resumeData, jobDescription } = await req.json();

        if (!jobDescription || !resumeData) {
            return NextResponse.json(
                { success: false, error: 'Missing job description or resume data' },
                { status: 400 }
            );
        }

        // Simplify resume data to text for the model to save tokens
        const resumeText = JSON.stringify(resumeData, null, 2);

        const result = await generateText({
            model: llamaModel,
            prompt: `You are an expert Applicant Tracking System (ATS) optimization AI.

Analyze the following Resume against the Job Description.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Task:
1. Identify critical keywords (skills, tools, certifications) in the Job Description.
2. Check if they exist in the Resume.
3. Assign a match score (0-100) based on:
   - Keyword matches (high weight)
   - Job title relevance
   - Experience relevance
4. List MISSING keywords that are in the JD but not the Resume.
5. Provide 3-5 specific, tactical improvements.

Be strict. A generic resume should not get a high score.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "score": <number between 0 and 100>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "feedback": ["improvement1", "improvement2", ...]
}`,
        });

        // Parse the JSON from the response
        const text = result.text.trim();
        // Extract JSON from the response (handle potential markdown code blocks)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse ATS score response');
        }

        const parsed = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            success: true,
            score: parsed.score,
            missingKeywords: parsed.missingKeywords || [],
            feedback: parsed.feedback || []
        });
    } catch (error) {
        console.error('Error calculating ATS score:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to calculate score' },
            { status: 500 }
        );
    }
}
