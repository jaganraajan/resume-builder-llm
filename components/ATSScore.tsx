'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { ResumeData } from './ResumeBuilder';

interface ATSScoreProps {
    resumeData: ResumeData;
    jobDescription: string;
}

interface ScoreResult {
    score: number;
    missingKeywords: string[];
    feedback: string[];
}

export default function ATSScore({ resumeData, jobDescription }: ATSScoreProps) {
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCheckScore = async () => {
        if (!jobDescription) {
            alert('Please enter a Job Description first.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/calculate-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeData, jobDescription }),
            });
            const data = await res.json();
            if (data.success) {
                setScoreResult(data);
                setIsExpanded(true);
            } else {
                alert('Failed to calculate score: ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while checking score.');
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500 border-green-500';
        if (score >= 50) return 'text-yellow-500 border-yellow-500';
        return 'text-red-500 border-red-500';
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between bg-secondary/10 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-lg">ATS Score</h3>
                    {scoreResult && (
                        <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-lg ${getScoreColor(scoreResult.score)}`}>
                            {scoreResult.score}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleCheckScore}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {scoreResult ? 'Re-check Score' : 'Check Score'}
                </button>
            </div>

            <AnimatePresence>
                {scoreResult && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                <span>Analysis Details</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {isExpanded && (
                                <div className="space-y-6 pt-2">
                                    {scoreResult.missingKeywords.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-2">
                                                <AlertCircle className="w-4 h-4" />
                                                Missing Keywords
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {scoreResult.missingKeywords.map((kw, i) => (
                                                    <span key={i} className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded-full border border-red-500/20">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {scoreResult.feedback.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Suggestions
                                            </h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                                {scoreResult.feedback.map((fb, i) => (
                                                    <li key={i}>{fb}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
