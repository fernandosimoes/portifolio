import { RESUME_DATA } from "@/data/resume";
import { AccordionItem } from "../ui/AccordionItem";
import { ExternalLink } from "lucide-react";

export const ProjectsCommand = ({ 
  expandedItems, 
  toggleExpand 
}: { 
  expandedItems: Set<string>; 
  toggleExpand: (id: string) => void;
}) => {
  return (
    <div className="mt-4 w-full max-w-5xl">
      <div className="text-stone-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 inline-block"></span>
        Deployed Codebases
      </div>
      <div className="flex flex-col gap-2">
        {RESUME_DATA.projects.map((p, idx) => {
          const projId = `proj-/projects-${idx}`;
          return (
            <AccordionItem 
              key={idx} 
              id={projId} 
              title={p.name} 
              status={p.status}
              isExpanded={expandedItems.has(projId)}
              onToggle={() => toggleExpand(projId)}
            >
              <div className="text-stone-300 leading-relaxed mb-6">
                {p.description}
              </div>
              
              <div className="mb-6">
                <div className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-3">Architecture & Stack</div>
                <div className="flex flex-wrap gap-2">
                  {p.techStack.map(t => (
                    <span key={t} className="px-2 py-1 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 text-xs font-mono rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {p.name === 'Wallet Rebalancing' && (
                <a 
                  href="http://wallet-rebalancing.devsimoes.com/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-white text-stone-950 text-sm font-bold transition-colors uppercase tracking-widest"
                >
                  Launch Application <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </AccordionItem>
          );
        })}
      </div>
    </div>
  );
};
