import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { llamaModel } from '@/lib/llm';

export const maxDuration = 60; // 60 seconds for tailoring

export async function POST(req: Request) {
    try {
        const { jobDescription, experiences, projects, extracurriculars, summary, currentCoverLetter, includeCoverLetter } = await req.json();

        if (!jobDescription) {
            return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
        }

        const prompt = `
        You are an expert ATS Resume Writer and Career Coach.
        Your task is to tailor a candidate's resume to a specific job description, ensuring it passes ATS checks and fits within a 2-page limit by selecting only the most relevant content.

        JOB DESCRIPTION:
        ${jobDescription}

        CANDIDATE DATA:
        SUMMARY: ${summary}
        EXPERIENCES: ${JSON.stringify(experiences)}
        PROJECTS: ${JSON.stringify(projects)}
        EXTRACURRICULARS: ${JSON.stringify(extracurriculars)}
        ${includeCoverLetter ? `CURRENT COVER LETTER: ${currentCoverLetter}` : ''}

        TASKS:

        1.  **PROFESSIONAL SUMMARY**: Rewrite the summary to be highly relevant to the job, highlighting key matches. Keep the length similar to the original summary (approx 4-5 sentences), focusing on impact and relevance. Do not drastically shorten it if the content is valuable.

        2.  **EXPERIENCE & PROJECT SELECTION (CRITICAL)**:
            -   **INCLUDE ALL PROVIDED WORK EXPERIENCES**. Do not filter or remove any previous roles.
            -   For **Projects**: Select the TOP 2-3 most relevant projects to save space, but ensure all work history is preserved.
            -   The goal is to fit within 2 pages if possible, but *never* at the cost of removing work history.
            -   If the "AI Resume Builder" or "GitHub Repository Analyzer" projects are relevant, prioritize them.

        3.  **EXTRACURRICULAR SELECTION (TOASTMASTERS RULE - CRITICAL)**:
            -   Review the extracurricular activities.
            -   **Toastmasters Experience**: ONLY include this if the Job Description explicitly requires strong **communication skills**, **public speaking**, **leadership**, or is for a role such as **Product Manager**, **Team Lead**, **Content Writer**, **Teaching Assistant**, or **Sales/Marketing**.
            -   **Software Developer Roles**: For standard individual contributor Software Engineering/Developer roles, **SKIP** Toastmasters unless the JD heavily emphasizes "collaboration", "mentoring", or "communication" as a primary requirement.
            -   If skipped, do not include it in the output array.

        4.  **CONTENT OPTIMIZATION**:
            -   Rewrite the bullet points for the selected experiences, projects, and extracurriculars.
            -   Use **keywords** from the job description naturally.
            -   Start bullet points with strong action verbs.
            -   Maintain a professional, ATS-friendly tone.

        ${includeCoverLetter ? `
        5.  **COVER LETTER TAILORING (MANDATORY)**:
            -   Use the "CURRENT COVER LETTER" as your base template.
            -   **Replace [Company Name]**: Insert the actual company name found in the Job Description.
            -   **Replace [Role Name]**: Insert the exact Job Title found in the Job Description.
            -   **CRITICAL FIX**: detailedly replace the placeholder "[specific reason about the company's AI initiatives, product, or mission]" (or similar variations) with 1-2 specific, authentic sentences explaining why the candidate is drawn to this *specific* company based on their JD. Mention their specific products, mission, or AI goals. **DO NOT** leave the bracketed text in the final output.
            -   **LENGTH & DEPTH**: The cover letter must be **LONG and DETAILED** (filling approx 3/4 to 1 full page). deeply elaborate on the candidate's specific achievements and how they directly map to the job requirements. Do not be brief. Add 2-3 substantive body paragraphs connecting past projects to the role's needs.
            -   Ensure the tone matches the rest of the letter.
            -   **JSON FORMATTING**: The cover letter content MUST be a single string. Use literal '\\n' characters for line breaks. **ABSOLUTELY NO** actual/invisible line breaks or newlines inside the string value.
        ` : ''}

        6.  **CONSTRAINTS**:
            -   **DO NOT** change company names, titles, or dates (except in Cover Letter placeholders).
            -   **DO NOT** hallucinate new experiences or projects.
            -   Return the data in the **EXACT** same JSON format as the input.

        Format your response as a JSON object with:
        {
          "summary": "new tailored summary",
          "experiences": [...same structure with updated description arrays],
          "projects": [...array containing ONLY the 3-4 selected projects with updated descriptions],
          "extracurriculars": [...filtered array based on the rules above]${includeCoverLetter ? `,
          "coverLetter": "The complete tailored cover letter text..."` : ''}
        }
        Do not include any other text in your response, only the raw JSON.
        `;

        const { text } = await generateText({
            model: llamaModel,
            prompt: prompt,
        });

        // Try to parse the LLM response as JSON
        try {
            // Find the first { and last } to handle any potential conversational wrapping
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            let jsonString = text.slice(jsonStart, jsonEnd);

            // Heuristic to fix unescaped newlines in coverLetter specifically
            // This looks for "coverLetter": "START...END" and attempts to preserve it while fixing internals
            // Since regex for full JSON string parsing is hard, we'll try a simpler approach if the first parse fails.

            let tailoredData;
            try {
                tailoredData = JSON.parse(jsonString);
            } catch (e) {
                // If parse fails, it might be due to unescaped newlines in the coverLetter string.
                // We'll try to blindly replace newlines with \n if they seem to be inside a value.
                // A safer heuristic: explicit control characters are often the culprit.
                // Let's try to remove control characters that are actual newlines, replacing them with \n
                // BUT we need to distinguish between formatting newlines (between keys) and string newlines.

                // Regex to find the coverLetter value and escape newlines inside it
                // Pattern: "coverLetter":\s*"((?:[^"\\]|\\.)*)"
                // This doesn't match if there are newlines, because . doesn't match newline.
                // So we use [\s\S]

                const coverLetterMatch = jsonString.match(/"coverLetter":\s*"([\s\S]*?)"(?=\s*[,}])/);
                if (coverLetterMatch) {
                    const originalValue = coverLetterMatch[1];
                    // If the value has physical newlines, replace them
                    if (originalValue.includes('\n')) {
                        const fixedValue = originalValue.replace(/\n/g, '\\n').replace(/\r/g, '');
                        // Replace only the first occurrence to avoid messing up if multiple matches (unlikely for specific key)
                        jsonString = jsonString.replace(originalValue, fixedValue);
                    }
                }
                tailoredData = JSON.parse(jsonString);
            }

            return NextResponse.json({
                success: true,
                ...tailoredData
            });
        } catch (parseError) {
            console.error('Failed to parse LLM response as JSON:', text);
            throw new Error('LLM failed to generate valid JSON data');
        }

    } catch (error: any) {
        console.error('Error generating tailored resume:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate resume' }, { status: 500 });
    }
}
