import { useState } from 'react';
import { Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface JobInputProps {
    onGenerate: (url: string) => void;
    isLoading: boolean;
}

export default function JobInput({ onGenerate, isLoading }: JobInputProps) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onGenerate(url);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    Job Description
                </h2>
                <p className="text-sm text-muted-foreground">Paste the URL of the job you are applying for.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="url"
                    required
                    placeholder="https://linkedin.com/jobs/..."
                    className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-muted-foreground/50"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={isLoading}
                />
                <div className="absolute right-2 top-2 bottom-2">
                    {/* Decorative icon inside input if needed */}
                </div>
            </form>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || !url.trim()}
                className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all",
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20",
                    isLoading && "opacity-70 cursor-not-allowed"
                )}
            >
                {isLoading ? (
                    <>Generating Resume...</>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Analyze & Generate Resume
                        <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                    </>
                )}
            </motion.button>
        </div>
    );
}
