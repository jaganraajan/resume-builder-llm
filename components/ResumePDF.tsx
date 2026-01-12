import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Styles } from '@react-pdf/renderer';
import { Experience, Project } from './ResumeBuilder';

// Register a standard font (optional, using valid standard fonts is safer for now)
// Times-Roman is a standard font available in PDF readers, mimicking the LaTeX look.

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Times-Roman',
        fontSize: 11,
        lineHeight: 1.2,
        color: '#000',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    name: {
        fontSize: 22,
        fontFamily: 'Times-Bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    contact: {
        fontSize: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 2,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Times-Bold',
        marginBottom: 4,
        textTransform: 'uppercase',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        paddingBottom: 2,
    },
    item: {
        marginBottom: 6,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 2,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    title: {
        fontFamily: 'Times-Bold',
        fontSize: 11,
        marginRight: 5,
    },
    company: {
        fontFamily: 'Times-Italic',
        fontSize: 11,
    },
    date: {
        fontSize: 10,
        fontFamily: 'Times-Italic',
    },
    description: {
        marginLeft: 0,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 1,
    },
    bullet: {
        width: 10,
        fontSize: 10,
        textAlign: 'right',
        paddingRight: 3,
    },
    bulletText: {
        flex: 1,
        textAlign: 'justify',
    },
    skillsConfig: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        marginTop: 2,
    },
    skillBadge: {
        fontSize: 10,
        fontFamily: 'Times-Italic',
    }
});

export interface ResumeData {
    experiences: Experience[];
    projects: Project[];
    extractedKeywords?: string[]; // From backend
}

interface ResumePDFProps {
    data: ResumeData;
}

export default function ResumePDF({ data }: ResumePDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.name}>John Doe</Text>
                    <View style={styles.contact}>
                        <Text>john.doe@example.com</Text>
                        <Text>•</Text>
                        <Text>+1 (555) 123-4567</Text>
                        <Text>•</Text>
                        <Text>linkedin.com/in/johndoe</Text>
                    </View>
                </View>

                {/* Dynamic Summary based on Keywords if available (Simulated) */}
                {data.extractedKeywords && data.extractedKeywords.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={{ marginBottom: 5 }}>
                            Highly skilled professional with expertise in {data.extractedKeywords.slice(0, 5).join(', ')}.
                            Proven track record of delivering high-quality solutions.
                        </Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Experience</Text>
                    {data.experiences.map((exp) => (
                        <View key={exp.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <View style={styles.headerLeft}>
                                    <Text style={styles.title}>{exp.title}</Text>
                                    <Text style={styles.company}> — {exp.company}</Text>
                                </View>
                                <Text style={styles.date}>{exp.period}</Text>
                            </View>
                            <View style={styles.description}>
                                {exp.description.map((desc, i) => (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{desc}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Projects</Text>
                    {data.projects.map((proj) => (
                        <View key={proj.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.title}>{proj.name}</Text>
                            </View>
                            <View style={[styles.description, { marginBottom: 2 }]}>
                                {proj.description.map((desc, i) => (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{desc}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={[styles.skillsConfig, { marginLeft: 10 }]}>
                                <Text style={{ fontSize: 10, fontFamily: 'Times-Bold', marginRight: 5 }}>Tech Stack:</Text>
                                {proj.technologies.map((tech, index) => (
                                    <Text key={tech} style={styles.skillBadge}>
                                        {tech}{index < proj.technologies.length - 1 ? ', ' : ''}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
