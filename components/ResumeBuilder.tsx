'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Loader2, Plus, Trash2, Edit3, Check, X, ArrowRight, Settings, Mail } from 'lucide-react';
import ExperienceSection from './ExperienceSection';
import JobInput from './JobInput';
import ATSScore from './ATSScore';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { INITIAL_DATA } from '@/lib/initialData';

const PDFPreview = dynamic(() => import('./PDFPreview'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading PDF Viewer...</div>
});

const CoverLetterPreview = dynamic(() => import('./CoverLetterPreview'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading PDF Viewer...</div>
});

// Re-export types for use in other components
export type Experience = {
    id: string;
    title: string;
    company: string;
    location: string;
    period: string;
    description: string[];
};

export type Project = {
    id: string;
    name: string;
    description: string[];
};

export type Education = {
    id: string;
    degree: string;
    school: string;
    location: string;
    period: string;
    gpa?: string;
};

export type ExtraCurricular = {
    id: string;
    title: string;
    organization: string;
    period: string;
    description: string[];
};

export type SkillCategory = {
    id: string;
    category: string;
    items: string;
};

export type PersonalInfo = {
    name: string;
    email: string;
    phone?: string;
    location: string;
    github?: string;
    linkedin?: string;
};

export type ResumeData = {
    personalInfo: PersonalInfo;
    summary: string;
    skills: SkillCategory[];
    experiences: Experience[];
    projects: Project[];
    education: Education[];
    extracurriculars: ExtraCurricular[];
    coverLetter?: string;
};

// Placeholder data for initial view (empty state)
const EMPTY_DATA: ResumeData = {
    personalInfo: {
        name: "",
        email: "",
        location: ""
    },
    summary: "",
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    extracurriculars: [],
    coverLetter: "",
};

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [generatedPreview, setGeneratedPreview] = useState<ResumeData | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [createCoverLetter, setCreateCoverLetter] = useState(false);
    const [targetRole, setTargetRole] = useState<string>('');

    // Load master resume or initial data just to have education/extras which might not be tailored
    // But for now, we want the "Edit Your Info" to be empty-ish until tailored? 
    // Actually, user said "populate the contents of the llm in the Edit Your Information section".
    // So let's start blank, and when they generate, we fill it.

    const handleDataChange = (newData: ResumeData) => {
        setResumeData(newData);
    };

    const handleGenerate = async (url: string) => {
        setIsGenerating(true);
        try {
            // 1. Get Master Resume from LocalStorage or Fallback
            const savedMaster = localStorage.getItem('masterResume');
            const masterData = savedMaster ? JSON.parse(savedMaster) : INITIAL_DATA;

            // 2. Parse Job Description
            const parseRes = await fetch('/api/parse-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const parseData = await parseRes.json();

            if (!parseData.success) throw new Error(parseData.error);

            setJobDescription(parseData.fullText);
            const jobTitle = parseData.jobTitle || "Role";

            // 3. Generate Tailored Content (using Master Data)
            const genRes = await fetch('/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobDescription: parseData.fullText,
                    experiences: masterData.experiences,
                    projects: masterData.projects,
                    extracurriculars: masterData.extracurriculars,
                    summary: masterData.summary,
                    currentCoverLetter: masterData.coverLetter,
                    includeCoverLetter: createCoverLetter
                }),
            });
            const genData = await genRes.json();

            if (!genData.success) throw new Error(genData.error);

            // 4. Merge Tailored Content with non-tailored Master Sections (Education, Skills, Extras)
            // Note: Skills *could* be tailored, but for now we just use master skills or if API returned new ones.
            // Our current API only returns summary, experiences, projects, and now extracurriculars.
            const tailoredResume: ResumeData = {
                ...masterData, // Start with everything from master
                summary: genData.summary || masterData.summary,
                experiences: genData.experiences,
                projects: genData.projects,
                extracurriculars: genData.extracurriculars || [],
                // Skills, Education remain as is from Master
                coverLetter: createCoverLetter
                    ? (genData.coverLetter || (masterData.coverLetter
                        ? masterData.coverLetter.replace("[Role Name]", jobTitle).replace("[Company Name]", "Target Company")
                        : "Dear Hiring Manager,\n\nPlease create a Master Cover Letter in the profile settings to enable automatic tailoring."))
                    : undefined
            };

            setResumeData(tailoredResume);
            setTargetRole(jobTitle);
            setHasGenerated(true);

        } catch (error) {
            console.error('Error generating resume:', error);
            alert('Failed to generate resume. Please check your console.');
        } finally {
            setIsGenerating(false);
        }
    };

    const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
        const newData = {
            ...resumeData,
            personalInfo: {
                ...resumeData.personalInfo,
                [field]: value
            }
        };
        setResumeData(newData);
        if (generatedPreview) {
            setGeneratedPreview({
                ...generatedPreview,
                personalInfo: newData.personalInfo
            });
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans">
            <header className="mb-10 flex flex-col items-center text-center gap-4">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    AI Resume Builder using Llama 3
                </h1>

                <div className="flex gap-4 items-center">
                    <Link href="/master-profile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm font-medium transition-colors border border-border">
                        <Settings className="w-4 h-4" />
                        Manage Master Profile
                    </Link>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Top Section: Job Input & Personal Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Job Input */}
                    <section className="bg-card border border-border rounded-xl p-8 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                Start Here: Paste Job URL
                            </h2>
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none text-muted-foreground hover:text-foreground transition-colors">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={createCoverLetter}
                                    onChange={(e) => setCreateCoverLetter(e.target.checked)}
                                />
                                Create Cover Letter
                            </label>
                        </div>
                        <JobInput onGenerate={handleGenerate} isLoading={isGenerating} />
                    </section>

                    {/* Right: Personal Info */}
                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm h-full">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-purple-400" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Full Name"
                                    value={resumeData.personalInfo?.name || ''}
                                    onChange={(e) => updatePersonalInfo('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Email Address"
                                    value={resumeData.personalInfo?.email || ''}
                                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Phone Number (Optional)"
                                    value={resumeData.personalInfo?.phone || ''}
                                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Location</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="Location"
                                    value={resumeData.personalInfo?.location || ''}
                                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">LinkedIn URL</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="LinkedIn URL"
                                    value={resumeData.personalInfo?.linkedin || ''}
                                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">GitHub URL</label>
                                <input
                                    className="w-full p-2 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    placeholder="GitHub URL"
                                    value={resumeData.personalInfo?.github || ''}
                                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Horizontally Scrollable 4-Section Row */}
                <div className="flex gap-8 overflow-x-auto pb-4">
                    {/* Resume Content Section */}
                    <motion.section
                        layout
                        className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 w-[600px] flex-shrink-0"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                    {hasGenerated ? "Tailored Result (Editable)" : "Resume Content"}
                                </h2>
                            </div>

                            {hasGenerated && jobDescription && (
                                <ATSScore resumeData={resumeData} jobDescription={jobDescription} />
                            )}
                        </div>

                        {!hasGenerated ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                                <ArrowRight className="w-8 h-8 mb-2 opacity-50" />
                                <p>Enter a Job URL above to generate your tailored resume.</p>
                                <div className="text-xs mt-2">The AI will use your <Link href="/master-profile" className="underline hover:text-blue-400">Master Profile</Link> as a base.</div>
                            </div>
                        ) : (
                            <ExperienceSection
                                data={resumeData}
                                onChange={handleDataChange}
                            />
                        )}
                    </motion.section>

                    {/* Resume Preview Section */}
                    <motion.div
                        layout
                        className="bg-muted/30 border border-border rounded-xl p-6 min-h-[1500px] min-w-[600px] flex-shrink-0 flex flex-col"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5 text-green-400" />
                            Resume Preview
                        </h2>
                        <div className="flex-1 bg-white rounded-lg shadow-inner overflow-hidden relative">
                            {hasGenerated || resumeData.summary || resumeData.personalInfo?.name ? (
                                <PDFPreview data={generatedPreview || resumeData} filenameRole={targetRole} />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <p>Ready to generate...</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
                                    <div className="text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-white mx-auto mb-2" />
                                        <p className="text-white font-medium">Reading Master Resume...</p>
                                        <p className="text-white/80 text-sm">Tailoring to Job Description...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Cover Letter Content Section */}
                    <motion.section
                        layout
                        className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col gap-6 min-w-[600px] flex-shrink-0"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Mail className="w-5 h-5 text-purple-400" />
                                Cover Letter Content
                            </h2>
                        </div>

                        {!hasGenerated ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                                <Mail className="w-8 h-8 mb-2 opacity-50" />
                                <p>Generate a tailored resume first.</p>
                                <p className="text-xs mt-2">Check "Create Cover Letter" above to include one.</p>
                            </div>
                        ) : !resumeData.coverLetter ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                                <Mail className="w-8 h-8 mb-2 opacity-50" />
                                <p>No cover letter generated.</p>
                                <p className="text-xs mt-2">Check "Create Cover Letter" and regenerate.</p>
                            </div>
                        ) : (
                            <textarea
                                className="flex-1 w-full p-4 bg-secondary/20 border border-border rounded-xl text-sm focus:ring-1 focus:ring-purple-500 outline-none resize-none min-h-[400px]"
                                value={resumeData.coverLetter}
                                onChange={(e) => setResumeData({ ...resumeData, coverLetter: e.target.value })}
                                placeholder="Your cover letter content..."
                            />
                        )}
                    </motion.section>

                    {/* Cover Letter Preview Section */}
                    <motion.div
                        layout
                        className="bg-muted/30 border border-border rounded-xl p-6 min-h-[1500px] min-w-[600px] flex-shrink-0 flex flex-col"
                    >
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5 text-purple-400" />
                            Cover Letter Preview
                        </h2>
                        <div className="flex-1 bg-white rounded-lg shadow-inner overflow-hidden relative">
                            {resumeData.coverLetter ? (
                                <CoverLetterPreview
                                    personalInfo={resumeData.personalInfo}
                                    coverLetter={resumeData.coverLetter}
                                    filenameRole={targetRole}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <p>No cover letter to preview...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

