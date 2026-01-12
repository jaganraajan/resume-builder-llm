'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, RotateCcw } from 'lucide-react';
import ExperienceSection from '@/components/ExperienceSection';
import { ResumeData } from '@/components/ResumeBuilder';
import { INITIAL_DATA } from '@/lib/initialData';
import { motion } from 'framer-motion';

export default function MasterResumePage() {
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);
    const [isClient, setIsClient] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        setIsClient(true);
        const saved = localStorage.getItem('masterResume');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse master resume", e);
            }
        }
    }, []);

    const handleChange = (newData: ResumeData) => {
        setData(newData);
        localStorage.setItem('masterResume', JSON.stringify(newData));
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your Master Resume to the default template? This cannot be undone.")) {
            handleChange(INITIAL_DATA);
        }
    };

    if (!isClient) return null; // Prevent hydration mismatch

    return (
        <div className="min-h-screen bg-background text-foreground p-8 font-sans max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-secondary/20 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Master Resume
                        </h1>
                        <p className="text-muted-foreground text-sm">This is your source of truth. All tailored resumes start from here.</p>
                    </div>
                </div>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Save className="w-5 h-5 text-green-400" />
                        Edit Master Data
                    </h2>
                    <span className="text-xs text-green-400/80 bg-green-400/10 px-2 py-1 rounded-full animate-pulse">
                        Auto-saving locally
                    </span>
                </div>

                <ExperienceSection data={data} onChange={handleChange} />
            </motion.div>
        </div>
    );
}
