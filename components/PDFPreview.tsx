'use client';

import { PDFViewer } from '@react-pdf/renderer';
import ResumePDF, { ResumeData } from './ResumePDF';

interface PDFPreviewProps {
    data: ResumeData;
}

export default function PDFPreview({ data }: PDFPreviewProps) {
    return (
        <PDFViewer className="w-full h-full border-none">
            <ResumePDF data={data} />
        </PDFViewer>
    );
}
