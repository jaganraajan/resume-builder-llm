'use client';

import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import ResumePDF from './ResumePDF';
import { ResumeData } from './ResumeBuilder';
import { Download } from 'lucide-react';

interface PDFPreviewProps {
    data: ResumeData;
    filenameRole?: string;
}

export default function PDFPreview({ data, filenameRole }: PDFPreviewProps) {
    const fileName = `Jagan_${(filenameRole || 'Role').replace(/\s+/g, '_')}_Resume.pdf`;

    return (
        <div className="w-full h-full flex flex-col relative">
            <div className="absolute top-4 right-6 z-10">
                <PDFDownloadLink
                    document={<ResumePDF data={data} />}
                    fileName={fileName}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition-colors text-sm font-medium"
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
                <ResumePDF data={data} />
            </PDFViewer>
        </div>
    );
}
