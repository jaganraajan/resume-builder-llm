import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { PersonalInfo } from './ResumeBuilder';

// Create styles (matching ResumePDF for consistency)
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 10,
        lineHeight: 1.4,
        color: '#000',
    },
    header: {
        marginBottom: 15,
        textAlign: 'center',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Times-Bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    contact: {
        fontSize: 9,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 5,
    },
});

interface CoverLetterPDFProps {
    personalInfo: PersonalInfo;
    coverLetter: string;
}

export default function CoverLetterPDF({ personalInfo, coverLetter }: CoverLetterPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>{personalInfo.name}</Text>
                    <View style={styles.contact}>
                        <Text>{personalInfo.email}</Text>
                        {personalInfo.phone && <Text>|</Text>}
                        {personalInfo.phone && <Text>{personalInfo.phone}</Text>}
                        <Text>|</Text>
                        <Text>{personalInfo.location}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 11, textAlign: 'justify', lineHeight: 1.5 }}>
                        {coverLetter}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
