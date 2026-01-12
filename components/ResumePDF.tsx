import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { ResumeData } from './ResumeBuilder';

// Create styles
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
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Times-Bold',
        marginBottom: 5,
        textTransform: 'uppercase',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        paddingBottom: 2,
    },
    summaryText: {
        textAlign: 'justify',
        marginBottom: 5,
    },
    skillsContainer: {
        flexDirection: 'column',
        gap: 2,
    },
    skillRow: {
        flexDirection: 'row',
        gap: 5,
    },
    skillCategory: {
        fontFamily: 'Times-Bold',
        width: 130,
    },
    skillItems: {
        flex: 1,
    },
    item: {
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    title: {
        fontFamily: 'Times-Bold',
        fontSize: 10.5,
    },
    company: {
        fontFamily: 'Times-Bold',
        fontSize: 10.5,
    },
    dateLocation: {
        fontSize: 9,
        fontFamily: 'Times-Italic',
        textAlign: 'right',
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
        fontFamily: 'Times-Italic',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 1,
        paddingLeft: 10,
    },
    bullet: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        textAlign: 'justify',
    }
});

interface ResumePDFProps {
    data: ResumeData;
}

export default function ResumePDF({ data }: ResumePDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.personalInfo.name}</Text>
                    <View style={styles.contact}>
                        <Text>{data.personalInfo.email}</Text>
                        {data.personalInfo.phone && <Text>|</Text>}
                        {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
                        <Text>|</Text>
                        <Text>{data.personalInfo.location}</Text>
                        {data.personalInfo.linkedin && <Text>|</Text>}
                        {data.personalInfo.linkedin && (
                            <Link
                                src={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`}
                                style={{ color: '#000', textDecoration: 'none' }}
                            >
                                {data.personalInfo.linkedin}
                            </Link>
                        )}
                        {data.personalInfo.github && <Text>|</Text>}
                        {data.personalInfo.github && (
                            <Link
                                src={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`}
                                style={{ color: '#000', textDecoration: 'none' }}
                            >
                                {data.personalInfo.github}
                            </Link>
                        )}
                    </View>
                </View>

                {/* Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <Text style={styles.summaryText}>{data.summary}</Text>
                </View>

                {/* Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={styles.skillsContainer}>
                        {data.skills.map(skill => (
                            <View key={skill.id} style={styles.skillRow}>
                                <Text style={styles.skillCategory}>{skill.category}:</Text>
                                <Text style={styles.skillItems}>{skill.items}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Experience */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Work Experience</Text>
                    {data.experiences.map((exp) => (
                        <View key={exp.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.title}>{exp.title}</Text>
                                <Text style={styles.dateLocation}>{exp.period}</Text>
                            </View>
                            <View style={styles.subHeader}>
                                <Text>{exp.company}</Text>
                                <Text>{exp.location}</Text>
                            </View>
                            <View>
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

                {/* Projects */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Open Source Projects</Text>
                    {data.projects.map((proj) => (
                        <View key={proj.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.title}>{proj.name}</Text>
                            </View>
                            <View>
                                {proj.description.map((desc, i) => (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{desc}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Education */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Education</Text>
                    {data.education.map((edu) => (
                        <View key={edu.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.title}>{edu.degree}</Text>
                                <Text style={styles.dateLocation}>{edu.period}</Text>
                            </View>
                            <View style={styles.subHeader}>
                                <Text>{edu.school}</Text>
                                <Text>{edu.location}</Text>
                            </View>
                            {edu.gpa && <Text style={{ fontSize: 9 }}>GPA: {edu.gpa}</Text>}
                        </View>
                    ))}
                </View>

                {/* Extra-curricular */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Extra-curricular Activities</Text>
                    {data.extracurriculars.map((activity) => (
                        <View key={activity.id} style={styles.item}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.title}>{activity.title}</Text>
                                <Text style={styles.dateLocation}>{activity.period}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Times-Italic', marginBottom: 2 }}>{activity.organization}</Text>
                            <View>
                                {activity.description.map((desc, i) => (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.bulletText}>{desc}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
}
