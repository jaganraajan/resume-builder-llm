'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2 } from 'lucide-react';
import ExperienceSection from './ExperienceSection';
import JobInput from './JobInput';
import dynamic from 'next/dynamic';
import { type ResumeData } from './ResumePDF';

const PDFPreview = dynamic(() => import('./PDFPreview'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading PDF Viewer...</div>
});

export type Experience = {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string[];
};

export type Project = {
    id: string;
    name: string;
    technologies: string[];
    description: string[];
};

const DUMMY_EXPERIENCE: Experience[] = [
    {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        period: '2021 - Present',
        description: [
            'Led migration of legacy monolith to microservices architecture.',
            'Improved system performance by 40% through code optimization.',
            'Mentored junior developers and conducted code reviews.',
        ],
    },
    {
        id: '2',
        title: 'Software Developer',
        company: 'StartupInc',
        period: '2019 - 2021',
        description: [
            'Developed full-stack web applications using React and Node.js.',
            'Implemented CI/CD pipelines to streamline deployment.',
            'Collaborated with product team to define feature requirements.',
        ],
    },
];

const DUMMY_PROJECTS: Project[] = [
    {
        id: '1',
        name: 'E-commerce Platform',
        technologies: ['Next.js', 'Stripe', 'PostgreSQL'],
        description: [
            'Built a scalable e-commerce platform handling 10k+ daily users.',
            'Integrated secure payment gateway with Stripe.',
        ],
    },
    {
        id: '2',
        name: 'AI Chatbot',
        technologies: ['Python', 'OpenAI API', 'React'],
        description: [
            'Created an AI-powered customer support chatbot.',
            'Reduced support ticket volume by 25%.',
        ],
    },
];

export default function ResumeBuilder() {
    const [experiences, setExperiences] = useState<Experience[]>(DUMMY_EXPERIENCE);
    const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null); // Store parsed/tailored data

    const handleGenerate = async (url: string) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/parse-job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
            const data = await response.json();
            setGeneratedData({ ...data, experiences, projects }); // Mock merging logic
        } catch (error) {
            console.error('Error generating resume:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    AI Resume Builder
                </h1>
                <p className="text-muted-foreground">Tailor your resume to any job description instantly.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                <div className="space-y-6">
                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-400" />
                            Your Experience
                        </h2>
                        <ExperienceSection experiences={experiences} projects={projects} />
                    </section>

                    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <JobInput onGenerate={handleGenerate} isLoading={isGenerating} />
                    </section>
                </div>

                <div className="bg-muted/30 border border-border rounded-xl p-6 h-[800px] flex flex-col">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Download className="w-5 h-5 text-green-400" />
                        Live Preview
                    </h2>
                    <div className="flex-1 bg-white rounded-lg shadow-inner overflow-hidden relative">
                        {generatedData ? (
                            <PDFPreview data={generatedData} />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <p>Enter a Job URL to generate your resume</p>
                            </div>
                        )}
                        {isGenerating && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <Loader2 className="w-10 h-10 animate-spin text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
