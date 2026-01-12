import { Experience, Project } from './ResumeBuilder';

interface ExperienceSectionProps {
    experiences: Experience[];
    projects: Project[];
}

export default function ExperienceSection({ experiences, projects }: ExperienceSectionProps) {
    return (
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Work History</h3>
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="p-3 bg-secondary/20 rounded-lg border border-border">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold">{exp.title}</h4>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">{exp.period}</span>
                            </div>
                            <p className="text-sm text-blue-400 mb-2">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {exp.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Projects</h3>
                <div className="space-y-4">
                    {projects.map((proj) => (
                        <div key={proj.id} className="p-3 bg-secondary/20 rounded-lg border border-border">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold">{proj.name}</h4>
                                <div className="flex gap-1">
                                    {proj.technologies.slice(0, 3).map(tech => (
                                        <span key={tech} className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">{tech}</span>
                                    ))}
                                </div>
                            </div>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {proj.description.map((desc, i) => (
                                    <li key={i}>{desc}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
