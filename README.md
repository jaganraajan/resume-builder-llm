# AI Resume Builder using Llama 3

An intelligent, AI-powered resume and cover letter builder that automatically tailors your application materials to specific job descriptions. Built with **Next.js 15**, **TypeScript**, **Vercel AI SDK**, and **Llama 3 70B** (via AWS Bedrock) or **OpenAI GPT models**.

---

## 🌟 Features

- **🤖 AI-Powered Resume Tailoring**: Automatically customizes your resume based on job descriptions
- **📄 Cover Letter Generation**: Creates personalized, detailed cover letters (3/4 to 1 page)
- **📊 ATS Score Calculator**: Real-time scoring to help you optimize for Applicant Tracking Systems
- **📥 Live PDF Preview & Download**: Instant preview and download of both resume and cover letter
- **💾 Master Profile Management**: Store your complete work history, projects, and skills in one place
- **🎯 Smart Content Selection**: AI selects the most relevant experiences and projects for each job
- **✨ Modern UI**: Beautiful, responsive interface with smooth animations

---

## 🚀 Quick Start Guide (For Everyone!)

### Prerequisites

You'll need:
1. **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
2. **An AI API Key** - Choose one:
   - **OpenAI API Key** (Recommended for beginners) - [Get it here](https://platform.openai.com/api-keys)
   - **AWS Bedrock Access** (Advanced) - Requires AWS account with Bedrock access

### Step 1: Download the Project

```bash
# If you have git installed:
git clone <repository-url>
cd resume-builder-llm

# OR download the ZIP file from GitHub and extract it
```

### Step 2: Install Dependencies

Open your terminal/command prompt in the project folder and run:

```bash
npm install
```

This will download all the necessary packages. It might take a few minutes.

### Step 3: Configure Your AI Provider

You have **two options** for running the AI:

#### **Option A: Using OpenAI (Recommended - Easiest Setup)**

1. **Get your OpenAI API Key**: Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) and create a new API key

2. **Create a `.env` file** in the project root folder with this content:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Update the LLM configuration**: 
   - Open the file `lib/llm.ts`
   - Replace the entire content with:
   ```typescript
   import { openai } from '@ai-sdk/openai';

   /**
    * Shared OpenAI client configuration using GPT-4o
    */
   export const llamaModel = openai('gpt-4o');
   ```

That's it! The app will now use OpenAI's GPT-4o model.

#### **Option B: Using AWS Bedrock with Llama 3 (Current Setup)**

1. **Set up AWS Bedrock access**: You need an AWS account with Bedrock enabled and access to Llama 3 70B

2. **Create a `.env` file** in the project root with:
   ```
   AWS_REGION=us-east-1
   AWS_BEARER_TOKEN_BEDROCK=your-aws-bearer-token
   ```

3. The existing `lib/llm.ts` is already configured for Bedrock - no changes needed!

### Step 4: Set Up Your Master Profile

1. **Copy the example data file**:
   ```bash
   cp lib/initialData.example.ts lib/initialData.ts
   ```

2. **Edit `lib/initialData.ts`** with your own information:
   - Personal info (name, email, location, LinkedIn, GitHub)
   - Professional summary
   - Work experiences
   - Projects
   - Education
   - Skills
   - Extracurricular activities
   - A master cover letter template

   **Important**: Keep the file structure the same, just replace the placeholder content with your own.

### Step 5: Run the Application

```bash
npm run dev
```

Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

You should see the AI Resume Builder interface!

---

## 📖 How to Use

### Creating Your First Tailored Resume

1. **Set up your Master Profile** (one-time setup):
   - Click "Manage Master Profile" in the header
   - Review and edit all your experiences, projects, skills, etc.
   - Add a master cover letter template
   - Save when done

2. **Generate a tailored resume**:
   - Go back to the main page
   - Paste a job posting URL in the input field
   - Check "Create Cover Letter" if you want one generated
   - Click "Generate"

3. **Review and Edit**:
   - The AI will tailor your resume to match the job description
   - Edit any section in the "Tailored Result" panel
   - See live preview on the right
   - Check your ATS score

4. **Download**:
   - Click "Download PDF" on the Resume Preview
   - Click "Download PDF" on the Cover Letter Preview
   - Files are named automatically: `<Name>_<JobTitle>_Resume.pdf` and `<Name>_<JobTitle>_Cover.pdf`

### Understanding ATS Score

The ATS (Applicant Tracking System) Score shows how well your resume matches the job description:
- **80-100%**: Excellent match
- **60-79%**: Good match
- **Below 60%**: Needs improvement

---

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **AI SDK**: Vercel AI SDK
- **AI Models**: 
  - Llama 3 70B (AWS Bedrock) - Default
  - GPT-4o (OpenAI) - Alternative
- **PDF Generation**: React-PDF
- **Styling**: TailwindCSS
- **Animations**: Framer Motion

---

## 📁 Project Structure

```
resume-builder-llm/
├── app/
│   ├── api/
│   │   ├── generate-resume/    # AI resume generation endpoint
│   │   ├── parse-job/          # Job description parser
│   │   └── calculate-score/    # ATS score calculator
│   ├── master-profile/         # Master profile management page
│   └── page.tsx                # Main resume builder page
├── components/
│   ├── ResumeBuilder.tsx       # Main UI component
│   ├── ResumePDF.tsx           # Resume PDF template
│   ├── CoverLetterPDF.tsx      # Cover letter PDF template
│   └── ...                     # Other UI components
├── lib/
│   ├── llm.ts                  # AI model configuration
│   └── initialData.ts          # Your master profile data (gitignored)
└── ...
```

---

## 🛠️ Troubleshooting

### "Failed to generate resume"
- Check that your `.env` file has the correct API key
- Verify your API key is active and has credits/access
- Check the browser console for detailed error messages

### "LLM failed to generate valid JSON data"
- This is usually a temporary issue - try generating again
- If it persists, the job description might be too long or unusual

### PDF not rendering
- Make sure all required data fields are filled in your Master Profile
- Try refreshing the page

### Changes not showing up
- The app uses hot reload, but sometimes you need to refresh manually
- If using OpenAI after switching from Bedrock, clear your browser cache

---

## 🔐 Privacy & Security

- Your master profile data (`lib/initialData.ts`) is **gitignored** and stays on your local machine
- Job descriptions and resumes are sent to the AI provider (OpenAI or AWS) for processing
- No data is stored on any external server (everything runs locally)
- Review OpenAI's or AWS's data policies if concerned about data handling

---

## 💡 Tips for Best Results

1. **Keep your Master Profile comprehensive**: Include all experiences, even if not actively using them
2. **Use detailed bullet points**: The AI tailors these, so more detail = better customization
3. **Create a good master cover letter template**: Use placeholders like `[Company Name]` and `[Role Name]`
4. **Review AI output**: Always review and edit the generated content before downloading
5. **Regenerate if needed**: If you don't like the result, click "Generate" again with the same URL

---

## 📝 License

This project is open source and available for personal use.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

## ⭐ Show Your Support

If this project helped you land an interview, consider giving it a star on GitHub!

---

**Happy job hunting! 🚀**
