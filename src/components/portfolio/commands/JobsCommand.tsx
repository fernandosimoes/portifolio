import { RESUME_DATA } from "@/data/resume";
import { AccordionItem } from "../ui/AccordionItem";

export const JobsCommand = ({ 
  collapsedItems, 
  toggleCollapse 
}: { 
  collapsedItems: Set<string>; 
  toggleCollapse: (id: string) => void;
}) => {
  return (
    <div className="mt-4 w-full max-w-5xl">
      <div className="text-stone-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-sky-500 inline-block"></span>
        Career History
      </div>
      <div className="flex flex-col gap-2">
        {RESUME_DATA.experience.map((job, idx) => {
          const jobId = `job-/jobs-${idx}`;
          return (
            <AccordionItem 
              key={idx} 
              id={jobId} 
              title={job.company} 
              subtitle={job.role} 
              meta={job.period}
              isExpanded={!collapsedItems.has(jobId)}
              onToggle={() => toggleCollapse(jobId)}
            >
              <div className="flex flex-wrap gap-4 text-xs text-stone-500 font-bold bg-stone-900 inline-block px-3 py-1.5 border border-stone-800 mb-6">
                <span>{job.location}</span>
              </div>

              <div className="text-stone-300 leading-relaxed mb-6">
                {job.description}
              </div>

              <div className="space-y-3 mb-8">
                <div className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">Key Execution</div>
                {job.achievements.map((ach, achIdx) => (
                  <div key={achIdx} className="flex gap-3 items-start text-sm">
                    <span className="text-sky-500 mt-0.5 opacity-50">›</span>
                    <p className="text-stone-400">{ach}</p>
                  </div>
                ))}
              </div>

              <div>
                 <div className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">Environment</div>
                <div className="flex flex-wrap gap-2">
                  {job.techStack.map(t => (
                    <span key={t} className="px-2 py-1 bg-stone-900 text-stone-400 border border-stone-800 text-xs font-mono rounded-sm cursor-default hover:bg-stone-800 transition-colors">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </div>
    </div>
  );
};
