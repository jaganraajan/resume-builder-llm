'use client';

import { PDFViewer } from '@react-pdf/renderer';
import CoverLetterPDF from './CoverLetterPDF';
import { PersonalInfo } from './ResumeBuilder';

interface CoverLetterPreviewProps {
    personalInfo: PersonalInfo;
    coverLetter: string;
}

export default function CoverLetterPreview({ personalInfo, coverLetter }: CoverLetterPreviewProps) {
    return (
        <PDFViewer className="w-full h-full border-none">
            <CoverLetterPDF personalInfo={personalInfo} coverLetter={coverLetter} />
        </PDFViewer>
    );
}
