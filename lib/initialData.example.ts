import { ResumeData } from "@/components/ResumeBuilder";

export const INITIAL_DATA: ResumeData = {
    personalInfo: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 555-010-9999",
        location: "New York, USA",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe"
    },
    summary: "Senior Software Engineer with experience in building scalable web applications and AI integrations. Passionate about clean code and user-centric design.",
    skills: [
        { id: '1', category: 'Backend', items: 'Node.js, Python, PostgreSQL' },
        { id: '2', category: 'Frontend', items: 'React, TypeScript, TailwindCSS' },
    ],
    experiences: [
        {
            id: '1',
            title: 'Senior Developer',
            company: 'Tech Corp',
            location: 'San Francisco, CA',
            period: '2020 - Present',
            description: [
                'Led development of cloud-native applications.',
                'Mentored junior developers and improved code quality.'
            ],
        }
    ],
    projects: [
        {
            id: '1',
            name: 'Project Alpha',
            description: [
                'An open-source tool for data analysis.',
                'Integrated with multiple 3rd party APIs.'
            ],
        }
    ],
    education: [
        {
            id: '1',
            degree: 'B.S. Computer Science',
            school: 'University of Technology',
            location: 'Boston, MA',
            period: '2016 - 2020',
        }
    ],
    extracurriculars: [
        {
            id: '1',
            title: 'Volunteer',
            organization: 'Local Community Coding',
            period: '2018 - 2020',
            description: [' taught python to high school students.'],
        }
    ],
    coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Role Name] position at [Company Name]. With my background in...",
};
