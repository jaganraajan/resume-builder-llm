'use client';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import CoverLetterPDF from './CoverLetterPDF';
import { PersonalInfo } from './ResumeBuilder';
import { Download } from 'lucide-react';

interface CoverLetterPreviewProps {
    personalInfo: PersonalInfo;
    coverLetter: string;
    filenameRole?: string;
}

export default function CoverLetterPreview({ personalInfo, coverLetter, filenameRole }: CoverLetterPreviewProps) {
    const fileName = `Jagan_${(filenameRole || 'Role').replace(/\s+/g, '_')}_Cover.pdf`;

    return (
        <div className="w-full h-full flex flex-col relative">
            <div className="absolute top-4 right-6 z-10">
                <PDFDownloadLink
                    document={<CoverLetterPDF personalInfo={personalInfo} coverLetter={coverLetter} />}
                    fileName={fileName}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full shadow hover:bg-purple-600 transition-colors text-sm font-medium"
                >
                    {/* @ts-ignore */}
                    {({ loading }) => (loading ? 'Loading...' : (
                        <>
                            <Download className="w-4 h-4" />
                            Download PDF
                        </>
                    ))}
                </PDFDownloadLink>
            </div>
            <PDFViewer className="w-full h-full border-none" showToolbar={false}>
                <CoverLetterPDF personalInfo={personalInfo} coverLetter={coverLetter} />
            </PDFViewer>
        </div>
    );
}
