interface Project {
  name: string;
  status: string;
  description: string;
  techStack: string[];
}

interface ProjectCardProps {
  projects: Project[];
}

export function ProjectCard({ projects }: ProjectCardProps) {
  return (
    <div className="space-y-4 mt-3">
      {projects.map((project) => (
        <div
          key={project.name}
          className="border-l-2 border-emerald-600 pl-4 py-2"
        >
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-emerald-400 font-bold font-mono text-sm">
              {project.name}
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 border border-emerald-800 text-emerald-500 bg-emerald-950">
              {project.status}
            </span>
          </div>

          <p className="text-stone-400 text-sm font-mono leading-relaxed mb-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-stone-800 border border-stone-700 px-2 py-0.5 font-mono text-stone-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
