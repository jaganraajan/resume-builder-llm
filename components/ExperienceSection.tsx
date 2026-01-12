import { useState } from 'react';
import { ResumeData, Experience, Project, Education, ExtraCurricular, SkillCategory } from './ResumeBuilder';
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface ExperienceSectionProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export default function ExperienceSection({ data, onChange }: ExperienceSectionProps) {
    const [activeSection, setActiveSection] = useState<string | null>('summary');

    const updateField = (field: keyof ResumeData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const toggleSection = (section: string) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Summary Section */}
            <SectionWrapper
                title="Professional Summary"
                isOpen={activeSection === 'summary'}
                onToggle={() => toggleSection('summary')}
            >
                <textarea
                    className="w-full h-32 p-3 bg-secondary/20 border border-border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                    value={data.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="Write a brief professional summary..."
                />
            </SectionWrapper>

            {/* Skills Section */}
            <SectionWrapper
                title="Skills"
                isOpen={activeSection === 'skills'}
                onToggle={() => toggleSection('skills')}
                onAdd={() => {
                    const newSkills = [...data.skills, { id: Date.now().toString(), category: 'New Category', items: '' }];
                    updateField('skills', newSkills);
                }}
            >
                <div className="space-y-3">
                    {data.skills.map((skill, idx) => (
                        <div key={skill.id} className="group relative p-3 bg-secondary/10 rounded-lg border border-border/50">
                            <button
                                onClick={() => updateField('skills', data.skills.filter(s => s.id !== skill.id))}
                                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                            <input
                                className="w-full bg-transparent font-semibold text-sm mb-1 outline-none border-b border-transparent focus:border-blue-500/50"
                                value={skill.category}
                                onChange={(e) => {
                                    const newSkills = [...data.skills];
                                    newSkills[idx].category = e.target.value;
                                    updateField('skills', newSkills);
                                }}
                                placeholder="Category (e.g. AI/ML)"
                            />
                            <textarea
                                className="w-full bg-transparent text-xs text-muted-foreground outline-none resize-none"
                                value={skill.items}
                                onChange={(e) => {
                                    const newSkills = [...data.skills];
                                    newSkills[idx].items = e.target.value;
                                    updateField('skills', newSkills);
                                }}
                                placeholder="Items (comma separated)"
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Work Experience Section */}
            <SectionWrapper
                title="Work Experience"
                isOpen={activeSection === 'experience'}
                onToggle={() => toggleSection('experience')}
                onAdd={() => {
                    const newItem: Experience = {
                        id: Date.now().toString(),
                        title: 'New Position',
                        company: 'Company',
                        location: '',
                        period: '2024 - Present',
                        description: ['Key achievement one']
                    };
                    updateField('experiences', [newItem, ...data.experiences]);
                }}
            >
                <div className="space-y-4">
                    {data.experiences.map((exp, idx) => (
                        <div key={exp.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 space-y-3 relative group">
                            <button
                                onClick={() => updateField('experiences', data.experiences.filter(e => e.id !== exp.id))}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-blue-500/50"
                                    value={exp.title}
                                    onChange={(e) => {
                                        const items = [...data.experiences];
                                        items[idx].title = e.target.value;
                                        updateField('experiences', items);
                                    }}
                                />
                                <input
                                    className="bg-transparent text-sm text-right text-muted-foreground outline-none border-b border-transparent focus:border-blue-500/50"
                                    value={exp.period}
                                    onChange={(e) => {
                                        const items = [...data.experiences];
                                        items[idx].period = e.target.value;
                                        updateField('experiences', items);
                                    }}
                                />
                                <input
                                    className="bg-transparent text-sm text-blue-400 outline-none border-b border-transparent focus:border-blue-500/50"
                                    value={exp.company}
                                    onChange={(e) => {
                                        const items = [...data.experiences];
                                        items[idx].company = e.target.value;
                                        updateField('experiences', items);
                                    }}
                                />
                                <input
                                    className="bg-transparent text-sm text-right text-muted-foreground outline-none border-b border-transparent focus:border-blue-500/50"
                                    value={exp.location}
                                    onChange={(e) => {
                                        const items = [...data.experiences];
                                        items[idx].location = e.target.value;
                                        updateField('experiences', items);
                                    }}
                                />
                            </div>
                            <BulletEditor
                                bullets={exp.description}
                                onChange={(bullets) => {
                                    const items = [...data.experiences];
                                    items[idx].description = bullets;
                                    updateField('experiences', items);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Projects Section */}
            <SectionWrapper
                title="Open Source Projects"
                isOpen={activeSection === 'projects'}
                onToggle={() => toggleSection('projects')}
                onAdd={() => {
                    const newItem: Project = {
                        id: Date.now().toString(),
                        name: 'Project Name',
                        description: ['Accomplishment one']
                    };
                    updateField('projects', [newItem, ...data.projects]);
                }}
            >
                <div className="space-y-4">
                    {data.projects.map((proj, idx) => (
                        <div key={proj.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 space-y-3 relative group">
                            <button
                                onClick={() => updateField('projects', data.projects.filter(p => p.id !== proj.id))}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <input
                                className="w-full bg-transparent font-bold text-sm outline-none border-b border-transparent focus:border-blue-500/50"
                                value={proj.name}
                                onChange={(e) => {
                                    const items = [...data.projects];
                                    items[idx].name = e.target.value;
                                    updateField('projects', items);
                                }}
                            />
                            <BulletEditor
                                bullets={proj.description}
                                onChange={(bullets) => {
                                    const items = [...data.projects];
                                    items[idx].description = bullets;
                                    updateField('projects', items);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Education Section */}
            <SectionWrapper
                title="Education"
                isOpen={activeSection === 'education'}
                onToggle={() => toggleSection('education')}
                onAdd={() => {
                    const newItem: Education = {
                        id: Date.now().toString(),
                        degree: 'Degree Name',
                        school: 'University',
                        location: '',
                        period: '20XX - 20XX'
                    };
                    updateField('education', [...data.education, newItem]);
                }}
            >
                <div className="space-y-4">
                    {data.education.map((edu, idx) => (
                        <div key={edu.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 space-y-2 relative group">
                            <button
                                onClick={() => updateField('education', data.education.filter(e => e.id !== edu.id))}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <input
                                className="w-full bg-transparent font-bold text-sm outline-none"
                                value={edu.degree}
                                onChange={(e) => {
                                    const items = [...data.education];
                                    items[idx].degree = e.target.value;
                                    updateField('education', items);
                                }}
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <input
                                    className="bg-transparent outline-none flex-1 mr-2"
                                    value={edu.school}
                                    onChange={(e) => {
                                        const items = [...data.education];
                                        items[idx].school = e.target.value;
                                        updateField('education', items);
                                    }}
                                />
                                <input
                                    className="bg-transparent outline-none text-right w-32"
                                    value={edu.period}
                                    onChange={(e) => {
                                        const items = [...data.education];
                                        items[idx].period = e.target.value;
                                        updateField('education', items);
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>

            {/* Extra-curricular Section */}
            <SectionWrapper
                title="Extra-curricular Activities"
                isOpen={activeSection === 'extra'}
                onToggle={() => toggleSection('extra')}
                onAdd={() => {
                    const newItem: ExtraCurricular = {
                        id: Date.now().toString(),
                        title: 'Role',
                        organization: 'Organization',
                        period: '20XX - Present',
                        description: ['Action taken']
                    };
                    updateField('extracurriculars', [...data.extracurriculars, newItem]);
                }}
            >
                <div className="space-y-4">
                    {data.extracurriculars.map((activity, idx) => (
                        <div key={activity.id} className="p-4 bg-secondary/10 rounded-lg border border-border/50 space-y-3 relative group">
                            <button
                                onClick={() => updateField('extracurriculars', data.extracurriculars.filter(e => e.id !== activity.id))}
                                className="absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="flex justify-between items-baseline">
                                <input
                                    className="bg-transparent font-bold text-sm outline-none"
                                    value={activity.title}
                                    onChange={(e) => {
                                        const items = [...data.extracurriculars];
                                        items[idx].title = e.target.value;
                                        updateField('extracurriculars', items);
                                    }}
                                />
                                <input
                                    className="bg-transparent text-sm text-muted-foreground text-right outline-none"
                                    value={activity.period}
                                    onChange={(e) => {
                                        const items = [...data.extracurriculars];
                                        items[idx].period = e.target.value;
                                        updateField('extracurriculars', items);
                                    }}
                                />
                            </div>
                            <input
                                className="w-full bg-transparent text-sm text-blue-400 outline-none"
                                value={activity.organization}
                                onChange={(e) => {
                                    const items = [...data.extracurriculars];
                                    items[idx].organization = e.target.value;
                                    updateField('extracurriculars', items);
                                }}
                            />
                            <BulletEditor
                                bullets={activity.description}
                                onChange={(bullets) => {
                                    const items = [...data.extracurriculars];
                                    items[idx].description = bullets;
                                    updateField('extracurriculars', items);
                                }}
                            />
                        </div>
                    ))}
                </div>
            </SectionWrapper>
        </div>
    );
}

function SectionWrapper({ title, children, isOpen, onToggle, onAdd }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void, onAdd?: () => void }) {
    return (
        <div className="border border-border/50 rounded-xl bg-card/50 overflow-hidden shadow-sm transition-all duration-200">
            <div
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/10 transition-colors ${isOpen ? 'bg-secondary/10' : ''}`}
                onClick={onToggle}
            >
                <span className="font-semibold text-sm flex items-center gap-2">
                    {title}
                </span>
                <div className="flex items-center gap-2">
                    {onAdd && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAdd(); }}
                            className="p-1 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>
            {isOpen && <div className="p-4 border-t border-border/50 bg-background/50 animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
}

function BulletEditor({ bullets, onChange }: { bullets: string[], onChange: (bullets: string[]) => void }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Key Points</span>
                <button
                    onClick={() => onChange([...bullets, ''])}
                    className="p-1 text-blue-400 hover:bg-blue-500/5 rounded transition-colors"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
            <div className="space-y-1.5 ml-2">
                {bullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-2 group items-start">
                        <span className="text-muted-foreground mt-1.5 opacity-40">•</span>
                        <textarea
                            className="flex-1 bg-transparent text-xs text-muted-foreground py-1 outline-none focus:text-foreground transition-colors resize-none"
                            value={bullet}
                            onChange={(e) => {
                                const newBullets = [...bullets];
                                newBullets[idx] = e.target.value;
                                onChange(newBullets);
                            }}
                            rows={bullet.length > 100 ? 3 : 1}
                        />
                        <button
                            onClick={() => onChange(bullets.filter((_, i) => i !== idx))}
                            className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
